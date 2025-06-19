import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, ShoppingCart, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getPlants, getOrders, getCategories } from '@/lib/firebase';
import PlantForm from '@/components/admin/PlantForm';
import OrderManagement from '@/components/admin/OrderManagement';

const Admin = () => {
  const { user } = useAuth();
  const [plants, setPlants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlantForm, setShowPlantForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [plantsData, ordersData, categoriesData] = await Promise.all([
          getPlants(),
          getOrders(),
          getCategories()
        ]);
        setPlants(plantsData);
        setOrders(ordersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Simple admin check - in a real app, this would be more robust
  const isAdmin = user?.email === 'admin@verdeluxe.com' || user?.displayName?.includes('Admin');

  if (!user) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Card className="glass max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <Users className="h-16 w-16 text-gray-400 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600">Please sign in to access the admin panel.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Card className="glass max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <Users className="h-16 w-16 text-red-400 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Access Required</h1>
            <p className="text-gray-600">You don't have permission to access this area.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  const activeOrders = orders.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length;

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-500 to-forest-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="font-sf text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl text-gray-200">Manage your Verde Luxe store</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Plants</p>
                    <p className="text-2xl font-bold text-forest-600">{plants.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-forest-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-forest-600">{orders.length}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-forest-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Orders</p>
                    <p className="text-2xl font-bold text-forest-600">{activeOrders}</p>
                  </div>
                  <Package className="h-8 w-8 text-gold-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-2xl font-bold text-forest-600">${totalRevenue.toFixed(2)}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="plants" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="plants">Plant Management</TabsTrigger>
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="plants" className="mt-6">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-forest-600">Plant Inventory</CardTitle>
                <Button
                  onClick={() => setShowPlantForm(true)}
                  className="bg-forest-500 hover:bg-forest-600 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plant
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-500 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading plants...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {plants.map((plant) => (
                      <motion.div
                        key={plant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-lg p-4 flex items-center gap-4"
                      >
                        <img
                          src={plant.imageUrls?.[0] || '/placeholder-plant.jpg'}
                          alt={plant.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-forest-600">{plant.name}</h4>
                          <p className="text-sm text-gray-600">{plant.description}</p>
                          <p className="text-forest-600 font-bold">${plant.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Stock: {plant.stock || 0}</p>
                          <p className="text-xs text-gray-500">
                            {plant.featured ? 'Featured' : 'Regular'}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <OrderManagement orders={orders} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-forest-600">Sales Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600">Advanced analytics and reporting features would be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Plant Form Modal */}
      {showPlantForm && (
        <PlantForm
          onClose={() => setShowPlantForm(false)}
          onSubmit={() => {
            setShowPlantForm(false);
            // Refresh plants list
            window.location.reload();
          }}
          categories={categories}
        />
      )}
    </div>
  );
};

export default Admin;
