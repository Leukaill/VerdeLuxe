import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Truck, Shield, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getPlantById } from '@/lib/firebase';

const ProductDetail = () => {
  const [, params] = useRoute('/product/:id');
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchPlant = async () => {
      if (!params?.id) return;
      
      setLoading(true);
      try {
        const plantData = await getPlantById(params.id);
        setPlant(plantData);
      } catch (error) {
        console.error('Failed to fetch plant:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlant();
  }, [params?.id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive"
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      await addItem(plant.id, quantity);
      toast({
        title: "Added to cart",
        description: `${quantity}x ${plant.name} added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-500 mx-auto"></div>
          <p className="text-gray-600">Loading plant details...</p>
        </div>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Plant not found</h1>
          <p className="text-gray-600">The plant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="aspect-square rounded-2xl overflow-hidden glass p-4">
              <img
                src={plant.imageUrls?.[selectedImage] || plant.imageUrls?.[0] || '/placeholder-plant.jpg'}
                alt={plant.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            
            {plant.imageUrls && plant.imageUrls.length > 1 && (
              <div className="flex gap-2">
                {plant.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-gold-500' : 'border-gray-200'
                    }`}
                  >
                    <img src={url} alt={`${plant.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                {plant.tags?.map((tag) => (
                  <Badge key={tag} className="bg-forest-500 text-white">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="font-sf text-4xl font-bold text-forest-600 mb-4">
                {plant.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {plant.description}
              </p>
            </div>

            {plant.rating && (
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(plant.rating) ? 'text-gold-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {plant.rating} ({plant.reviewCount} reviews)
                </span>
              </div>
            )}

            <div className="text-4xl font-bold text-forest-600">
              ${plant.price?.toFixed(2)}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || (plant.stock !== undefined && plant.stock <= 0)}
                  className="flex-1 bg-forest-500 hover:bg-forest-600 text-white py-3 text-lg font-semibold"
                >
                  {isAddingToCart ? (
                    'Adding to Cart...'
                  ) : plant.stock !== undefined && plant.stock <= 0 ? (
                    'Out of Stock'
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white p-3"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <Truck className="h-6 w-6 text-forest-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Free Shipping</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 text-forest-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Plant Guarantee</p>
                </CardContent>
              </Card>
              <Card className="glass">
                <CardContent className="p-4 text-center">
                  <Leaf className="h-6 w-6 text-forest-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Care Support</p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <Tabs defaultValue="care" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="care">Care Instructions</TabsTrigger>
              <TabsTrigger value="details">Plant Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="care" className="mt-6">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-forest-600 mb-2">Light Requirements</h3>
                      <p className="text-gray-600">{plant.lightRequirement || 'Bright, indirect light'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-600 mb-2">Watering</h3>
                      <p className="text-gray-600">{plant.wateringFrequency || 'Water when top inch of soil is dry'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-600 mb-2">Difficulty Level</h3>
                      <p className="text-gray-600">{plant.difficultyLevel || 'Beginner friendly'}</p>
                    </div>
                    {plant.careInstructions && (
                      <div>
                        <h3 className="font-semibold text-forest-600 mb-2">Additional Care Tips</h3>
                        <p className="text-gray-600">{plant.careInstructions}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-6">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-forest-600 mb-4">Plant Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Scientific Name:</span>
                          <span>{plant.scientificName || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Origin:</span>
                          <span>{plant.origin || 'Tropical regions'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mature Size:</span>
                          <span>{plant.matureSize || '3-6 feet'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pet Safe:</span>
                          <span>{plant.petSafe ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-forest-600 mb-4">Care Requirements</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Humidity:</span>
                          <span>{plant.humidityLevel || 'Medium'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temperature:</span>
                          <span>{plant.temperatureRange || '65-75°F'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fertilizer:</span>
                          <span>{plant.fertilizerNeeds || 'Monthly during growing season'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Repotting:</span>
                          <span>{plant.repottingFrequency || 'Every 2-3 years'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card className="glass">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-600">Reviews functionality would be implemented here with Firebase Firestore.</p>
                    <p className="text-sm text-gray-500 mt-2">Users could leave ratings and comments for plants.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
