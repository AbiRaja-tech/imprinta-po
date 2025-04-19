import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { PurchaseOrder } from './purchase-orders';
import { Timestamp } from 'firebase/firestore';

interface FirestoreData {
  poNumber?: string;
  supplier?: string;
  orderDate?: Timestamp;
  createdAt?: Timestamp;
  date?: Timestamp;
  status?: string;
  totalAmount?: number;
  projectRef?: string;
}

interface PurchaseOrderData {
  id: string;
  poNumber: string;
  supplier: string;
  date: Date;
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
    const purchaseOrders = await Promise.all(poSnapshot.docs.map(async docSnapshot => {
      const data = docSnapshot.data() as FirestoreData;
      
      // Fetch supplier name if supplier reference exists
      let supplierName = '';
      if (data.supplier) {
        try {
          const supplierDocRef = doc(db, 'suppliers', data.supplier);
          const supplierDoc = await getDoc(supplierDocRef);
          if (supplierDoc.exists()) {
            const supplierData = supplierDoc.data();
            supplierName = supplierData?.name || '';
          }
        } catch (error) {
          console.error('Error fetching supplier:', error);
        }
      }

      // Handle the date field - try orderDate first, then createdAt
      let processedDate: Date = new Date();
      if (data.orderDate instanceof Timestamp) {
        processedDate = data.orderDate.toDate();
      } else if (data.createdAt instanceof Timestamp) {
        processedDate = data.createdAt.toDate();
      }

      const processedPO: PurchaseOrderData = {
        id: docSnapshot.id,
        poNumber: data.poNumber || '',
        supplier: supplierName,
        date: processedDate,
        status: data.status || '',
        total: data.totalAmount || 0,
        project: data.projectRef || 'N/A' // Use projectRef directly as the project name
      };

      return processedPO;
    }));

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
        case 'received':
          stats.completed++;
          break;
      }
    });

    // Get 5 most recent POs
    stats.recentPurchaseOrders = purchaseOrders
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);

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