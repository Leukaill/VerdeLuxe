import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Heart, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getOrders, getWishlistItems } from '@/lib/firebase';
import { Link } from 'wouter';

const Profile = () => {
  const { user, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const [ordersData, wishlistData] = await Promise.all([
          getOrders(user.uid),
          getWishlistItems(user.uid)
        ]);
        setOrders(ordersData);
        setWishlistItems(wishlistData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Card className="glass max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <User className="h-16 w-16 text-gray-400 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Sign In Required</h1>
            <p className="text-gray-600">Please sign in to view your profile.</p>
            <Link href="/">
              <button className="bg-forest-500 hover:bg-forest-600 text-white px-6 py-2 rounded-lg">
                Go Home
              </button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'paid':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-500 to-forest-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-6 text-white"
          >
            <img
              src={user.photoURL || '/default-avatar.png'}
              alt={user.displayName || 'Profile'}
              className="w-20 h-20 rounded-full border-4 border-white/20"
            />
            <div>
              <h1 className="font-sf text-4xl font-bold mb-2">
                {user.displayName || 'Welcome'}
              </h1>
              <p className="text-xl text-gray-200">{user.email}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-forest-600">Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">Start shopping to see your orders here.</p>
                    <Link href="/products">
                      <button className="bg-forest-500 hover:bg-forest-600 text-white px-6 py-2 rounded-lg">
                        Browse Plants
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-forest-600">
                              Order #{order.orderNumber}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge className={`${getStatusColor(order.status)} text-white`}>
                              {order.status}
                            </Badge>
                            <p className="font-bold text-forest-600 mt-1">
                              ${order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        {order.shippingAddress && (
                          <div className="text-sm text-gray-600">
                            <p>Shipping to: {order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="mt-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-forest-600">Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading wishlist...</p>
                  </div>
                ) : wishlistItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites yet</h3>
                    <p className="text-gray-600 mb-4">Save plants you love to your wishlist.</p>
                    <Link href="/products">
                      <button className="bg-forest-500 hover:bg-forest-600 text-white px-6 py-2 rounded-lg">
                        Browse Plants
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlistItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-lg p-4"
                      >
                        <img
                          src={item.plant?.imageUrls?.[0] || '/placeholder-plant.jpg'}
                          alt={item.plant?.name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h4 className="font-semibold text-forest-600 mb-1">
                          {item.plant?.name}
                        </h4>
                        <p className="text-forest-600 font-bold">
                          ${item.plant?.price?.toFixed(2)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-forest-600">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Profile Information</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Name:</span> {user.displayName || 'Not provided'}</p>
                      <p><span className="text-gray-600">Email:</span> {user.email}</p>
                      <p><span className="text-gray-600">Member since:</span> {new Date(user.metadata?.creationTime || '').toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4">Account Actions</h3>
                    <button
                      onClick={signOut}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
