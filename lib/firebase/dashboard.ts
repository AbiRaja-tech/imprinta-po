import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { PurchaseOrder } from './purchase-orders';
import { Timestamp } from 'firebase/firestore';

interface PurchaseOrderData {
  id: string;
  poNumber: string;
  supplier: string;
  date: Timestamp | string;
  status: string;
  total: number;
  project: string;
}

interface RecentPurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  date: Date;
  status: string;
  total: number;
  project: string;
}

export interface DashboardStats {
  draft: number;
  sent: number;
  pending: number;
  completed: number;
  recentPurchaseOrders: RecentPurchaseOrder[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const poCollection = collection(db, 'purchaseOrders');
    
    // Get all POs
    const poSnapshot = await getDocs(poCollection);
    const purchaseOrders = poSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PurchaseOrderData[];

    // Count POs by status
    const stats: DashboardStats = {
      draft: 0,
      sent: 0,
      pending: 0,
      completed: 0,
      recentPurchaseOrders: []
    };

    // Process each PO
    purchaseOrders.forEach(po => {
      switch (po.status?.toLowerCase()) {
        case 'draft':
          stats.draft++;
          break;
        case 'sent':
          stats.sent++;
          break;
        case 'pending':
          stats.pending++;
          break;
        case 'completed':
          stats.completed++;
          break;
      }
    });

    // Get 5 most recent POs
    stats.recentPurchaseOrders = purchaseOrders
      .sort((a, b) => {
        const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date);
        const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map(po => ({
        id: po.id,
        poNumber: po.poNumber || '',
        supplier: po.supplier || '',
        date: po.date instanceof Timestamp ? po.date.toDate() : new Date(po.date),
        status: po.status || '',
        total: po.total || 0,
        project: po.project || ''
      }));

    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

export async function getRecentPurchaseOrders(): Promise<(PurchaseOrder & { id: string })[]> {
  try {
    const q = query(
      collection(db, 'purchaseOrders'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      orderDate: doc.data().orderDate.toDate(),
      deliveryDate: doc.data().deliveryDate.toDate(),
      createdAt: doc.data().createdAt.toDate(),
    })) as (PurchaseOrder & { id: string })[];
  } catch (error) {
    console.error('Error fetching recent purchase orders:', error);
    throw error;
  }
} 