import { collection, query, getDocs, where, orderBy, Timestamp, getDoc, doc } from 'firebase/firestore';
import { db } from './config';
import { PurchaseOrder } from './purchase-orders';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Supplier } from './suppliers';
import { ItemType } from './types';

// Define item type mappings
const itemTypeNames: Record<string, string> = {
  'paper': 'Paper',
  'ink': 'Ink',
  'packaging': 'Packaging',
  'machinery': 'Machinery',
  'outsourced': 'Outsourced Print',
};

export interface ReportStats {
  totalPOs: number;
  totalSpent: number;
  averagePOValue: number;
  monthlyPOCount: {
    month: string;
    count: number;
  }[];
  supplierSpend: {
    supplier: string;
    total: number;
  }[];
  itemTypeDistribution: {
    type: string;
    count: number;
    total: number;
  }[];
  changeFromPrevious: {
    poCount: number;
    spent: number;
    average: number;
  };
}

export async function getReportStats(period: 'current' | 'previous' = 'current'): Promise<ReportStats> {
  try {
    const now = new Date();
    const startDate = period === 'current' 
      ? startOfMonth(now)
      : startOfMonth(subMonths(now, 1));
    const endDate = period === 'current'
      ? endOfMonth(now)
      : endOfMonth(subMonths(now, 1));

    // Fetch all types first
    const typesSnapshot = await getDocs(collection(db, 'types'));
    const typeDetails = new Map<string, ItemType>();
    typesSnapshot.docs.forEach(doc => {
      typeDetails.set(doc.id, { id: doc.id, ...doc.data() } as ItemType);
    });

    const q = query(
      collection(db, 'purchaseOrders'),
      where('orderDate', '>=', Timestamp.fromDate(startDate)),
      where('orderDate', '<=', Timestamp.fromDate(endDate)),
      orderBy('orderDate', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      orderDate: doc.data().orderDate.toDate(),
      deliveryDate: doc.data().deliveryDate.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as (PurchaseOrder & { id: string })[];

    // Get supplier details
    const supplierDetails = new Map<string, Supplier>();
    for (const order of orders) {
      if (!supplierDetails.has(order.supplier)) {
        const supplierDoc = await getDoc(doc(db, 'suppliers', order.supplier));
        if (supplierDoc.exists()) {
          supplierDetails.set(order.supplier, supplierDoc.data() as Supplier);
        }
      }
    }

    // Calculate basic stats
    const totalPOs = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averagePOValue = totalPOs > 0 ? totalSpent / totalPOs : 0;

    // Calculate supplier spend with names
    const supplierSpend = orders.reduce((acc, order) => {
      const supplierName = supplierDetails.get(order.supplier)?.name || order.supplier;
      const existing = acc.find(s => s.supplier === supplierName);
      if (existing) {
        existing.total += order.totalAmount;
      } else {
        acc.push({ supplier: supplierName, total: order.totalAmount });
      }
      return acc;
    }, [] as { supplier: string; total: number }[]);

    // Calculate item type distribution with proper names from types collection
    const itemTypeDistribution = orders.reduce((acc, order) => {
      order.lineItems.forEach(item => {
        const typeName = typeDetails.get(item.type)?.name || item.type;
        const existing = acc.find(t => t.type === typeName);
        if (existing) {
          existing.count += 1;
          existing.total += item.totalPrice;
        } else {
          acc.push({ type: typeName, count: 1, total: item.totalPrice });
        }
      });
      return acc;
    }, [] as { type: string; count: number; total: number }[]);

    // Get monthly PO count for the last 12 months
    const monthlyPOCount = Array.from({ length: 12 }, (_, i) => {
      const month = subMonths(now, i);
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const count = orders.filter(
        order => order.orderDate >= monthStart && order.orderDate <= monthEnd
      ).length;
      return {
        month: month.toLocaleString('default', { month: 'short' }),
        count,
      };
    }).reverse();

    // Get previous period stats for comparison
    const previousStats = period === 'current' ? await getReportStats('previous') : null;
    const changeFromPrevious = previousStats ? {
      poCount: previousStats.totalPOs > 0 ? ((totalPOs - previousStats.totalPOs) / previousStats.totalPOs) * 100 : 0,
      spent: previousStats.totalSpent > 0 ? ((totalSpent - previousStats.totalSpent) / previousStats.totalSpent) * 100 : 0,
      average: previousStats.averagePOValue > 0 ? ((averagePOValue - previousStats.averagePOValue) / previousStats.averagePOValue) * 100 : 0,
    } : {
      poCount: 0,
      spent: 0,
      average: 0,
    };

    return {
      totalPOs,
      totalSpent,
      averagePOValue,
      monthlyPOCount,
      supplierSpend,
      itemTypeDistribution,
      changeFromPrevious,
    };
  } catch (error) {
    console.error('Error fetching report stats:', error);
    throw error;
  }
} 