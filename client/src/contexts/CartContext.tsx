import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getCartItems, addToCart, updateCartItem, removeFromCart, clearCart } from '@/lib/firebase';

interface CartItem {
  id: string;
  plantId: string;
  quantity: number;
  plant?: any;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (plantId: string, quantity?: number) => Promise<void>;
  updateItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearItems: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCartItems = async () => {
    if (!user) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const cartItems = await getCartItems(user.uid);
      setItems(cartItems);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [user]);

  const addItem = async (plantId: string, quantity: number = 1) => {
    if (!user) throw new Error('User must be logged in');
    
    try {
      await addToCart(user.uid, plantId, quantity);
      await fetchCartItems();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  };

  const updateItem = async (cartItemId: string, quantity: number) => {
    try {
      await updateCartItem(cartItemId, quantity);
      await fetchCartItems();
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId);
      await fetchCartItems();
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      throw error;
    }
  };

  const clearItems = async () => {
    if (!user) return;
    
    try {
      await clearCart(user.uid);
      setItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.plant?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const value = {
    items,
    loading,
    addItem,
    updateItem,
    removeItem,
    clearItems,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
