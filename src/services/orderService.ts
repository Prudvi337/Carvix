import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { authService } from './auth';

export interface Order {
  id?: string;
  userId: string;
  customerName: string;
  email: string;
  deliveryAddress: string;
  estimatedDelivery: string;
  totalAmount: number;
  buildDetails: any;
  createdAt?: Date;
}

class OrderService {
  private db = getFirestore();

  // Create a new order in Firestore
  async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    const orderData = {
      ...order,
      userId: user.uid,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(this.db, 'orders'), orderData);
    return docRef.id;
  }

  // Fetch order by ID
  async getOrderById(orderId: string): Promise<Order | null> {
    const orderRef = doc(this.db, 'orders', orderId);
    const orderSnap = await getDoc(orderRef);
    if (!orderSnap.exists()) return null;
    const data = orderSnap.data();
    return {
      id: orderSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Order;
  }
}

export const orderService = new OrderService(); 