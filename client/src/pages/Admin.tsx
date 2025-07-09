import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, ShoppingCart, Users, BarChart3, Database, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getPlants, getOrders, getCategories } from '@/lib/firebase';
import { seedFirestoreSimple } from '@/lib/seedFirestore';
import { useToast } from '@/hooks/use-toast';
import PlantForm from '@/components/admin/PlantForm';
import OrderManagement from '@/components/admin/OrderManagement';

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [plants, setPlants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPlantForm, setShowPlantForm] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [dbStatus, setDbStatus] = useState({ connected: false, message: '', timestamp: '', loading: true });
  const [firestoreStatus, setFirestoreStatus] = useState({ connected: false, message: '', loading: true });

  const checkDatabaseStatus = async () => {
    try {
      const response = await fetch('/api/database/status');
      const data = await response.json();
      setDbStatus({ ...data, loading: false });
    } catch (error) {
      setDbStatus({ 
        connected: false, 
        message: 'Failed to check database connection', 
        timestamp: new Date().toISOString(),
        loading: false 
      });
    }
  };

  const checkFirestoreStatus = async () => {
    try {
      // Test Firestore connection by trying to fetch categories
      const categories = await getCategories();
      setFirestoreStatus({ 
        connected: true, 
        message: 'Firestore connection successful',
        loading: false 
      });
    } catch (error) {
      setFirestoreStatus({ 
        connected: false, 
        message: 'Firestore connection failed', 
        loading: false 
      });
    }
  };

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
    checkDatabaseStatus();
    checkFirestoreStatus();
  }, []);

  // Check if admin is authenticated via local storage (from AdminModal)
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    setIsAdmin(adminAuth === 'true');
  }, []);

  if (!isAdmin) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Card className="glass max-w-md w-full mx-4">
          <CardContent className="p-8 text-center space-y-4">
            <Users className="h-16 w-16 text-red-400 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Access Required</h1>
            <p className="text-gray-600">Please authenticate through the admin login to access this area.</p>
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-forest-500 hover:bg-forest-600 text-white"
            >
              Go to Homepage
            </Button>
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
        <div className="grid md:grid-cols-5 gap-6 mb-8">
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Database Status</p>
                    <div className="space-y-1 mt-1">
                      <div className="flex items-center gap-2">
                        {dbStatus.loading ? (
                          <RefreshCw className="h-3 w-3 animate-spin text-gray-500" />
                        ) : dbStatus.connected ? (
                          <Wifi className="h-3 w-3 text-green-500" />
                        ) : (
                          <WifiOff className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-xs font-medium ${dbStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
                          PostgreSQL: {dbStatus.loading ? 'Checking...' : dbStatus.connected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {firestoreStatus.loading ? (
                          <RefreshCw className="h-3 w-3 animate-spin text-gray-500" />
                        ) : firestoreStatus.connected ? (
                          <Wifi className="h-3 w-3 text-green-500" />
                        ) : (
                          <WifiOff className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-xs font-medium ${firestoreStatus.connected ? 'text-green-600' : 'text-red-600'}`}>
                          Firestore: {firestoreStatus.loading ? 'Checking...' : firestoreStatus.connected ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      checkDatabaseStatus();
                      checkFirestoreStatus();
                    }}
                    size="sm"
                    variant="outline"
                    className="p-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="plants" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="plants">Plant Management</TabsTrigger>
            <TabsTrigger value="orders">Order Management</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
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

          <TabsContent value="database" className="mt-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="text-forest-600 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Seed Firestore Database</h3>
                  <p className="text-blue-700 mb-4">
                    This will populate your Firestore database with sample categories, plants, and content data. 
                    Perfect for getting started with your Verde Luxe store.
                  </p>
                  <Button
                    onClick={async () => {
                      setSeeding(true);
                      try {
                        await seedFirestoreSimple();
                        toast({
                          title: "Success",
                          description: "Firestore database has been seeded successfully!"
                        });
                        // Refresh data
                        setTimeout(() => window.location.reload(), 1000);
                      } catch (error) {
                        console.error('Seeding error:', error);
                        toast({
                          title: "Error",
                          description: "Failed to seed database. Please try again.",
                          variant: "destructive"
                        });
                      } finally {
                        setSeeding(false);
                      }
                    }}
                    disabled={seeding}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {seeding ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Seeding Database...
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Seed Firestore Database
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Database Status</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-forest-600">{plants.length}</p>
                      <p className="text-sm text-gray-600">Plants</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-forest-600">{categories.length}</p>
                      <p className="text-sm text-gray-600">Categories</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-forest-600">{orders.length}</p>
                      <p className="text-sm text-gray-600">Orders</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
