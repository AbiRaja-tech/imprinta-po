import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './config';
import { PurchaseOrder } from './purchase-orders';

export interface DashboardStats {
  draft: number;
  sent: number;
  pending: number;
  completed: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const purchaseOrdersRef = collection(db, 'purchaseOrders');
    const stats: DashboardStats = {
      draft: 0,
      sent: 0,
      pending: 0,
      completed: 0,
    };

    // Get counts for each status
    const draftQuery = query(purchaseOrdersRef, where('status', '==', 'Draft'));
    const sentQuery = query(purchaseOrdersRef, where('status', '==', 'Sent'));
    const pendingQuery = query(purchaseOrdersRef, where('status', '==', 'Pending'));
    const completedQuery = query(purchaseOrdersRef, where('status', '==', 'Closed'));

    const [draftSnap, sentSnap, pendingSnap, completedSnap] = await Promise.all([
      getDocs(draftQuery),
      getDocs(sentQuery),
      getDocs(pendingQuery),
      getDocs(completedQuery),
    ]);

    stats.draft = draftSnap.size;
    stats.sent = sentSnap.size;
    stats.pending = pendingSnap.size;
    stats.completed = completedSnap.size;

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