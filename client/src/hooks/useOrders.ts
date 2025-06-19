import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus, createOrder } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalAmount: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  items?: Array<{
    plantId: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (userId?: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders(userId);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    await fetchOrders(user.uid);
  };

  const fetchAllOrders = async () => {
    await fetchOrders();
  };

  const updateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatus(orderId, status);
      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
      console.error('Error updating order status:', err);
      return false;
    }
  };

  const placeOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      const result = await createOrder(orderData);
      // Refresh orders after placing new order
      await fetchUserOrders();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
      console.error('Error placing order:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, [user]);

  const getOrdersByStatus = (status: Order['status']) => {
    return orders.filter(order => order.status === status);
  };

  const getOrderStats = () => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const pendingOrders = getOrdersByStatus('pending').length;
    const processingOrders = getOrdersByStatus('processing').length;
    const shippedOrders = getOrdersByStatus('shipped').length;
    const deliveredOrders = getOrdersByStatus('delivered').length;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
    };
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    fetchUserOrders,
    fetchAllOrders,
    updateStatus,
    placeOrder,
    getOrdersByStatus,
    getOrderStats,
  };
};
