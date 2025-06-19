import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface Plant {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  stock?: number;
}

interface ProductCardProps {
  plant: Plant;
}

const ProductCard = ({ plant }: ProductCardProps) => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
      await addItem(plant.id);
      toast({
        title: "Added to cart",
        description: `${plant.name} has been added to your cart`,
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

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist",
        variant: "destructive"
      });
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${plant.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist`,
    });
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'premium':
        return 'bg-gold-500';
      case 'low light':
        return 'bg-green-500';
      case 'trending':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <Link href={`/product/${plant.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="glass rounded-2xl p-6 hover-lift group cursor-pointer"
      >
        <div className="relative mb-4">
          <img
            src={plant.imageUrls[0] || '/placeholder-plant.jpg'}
            alt={plant.name}
            className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform"
          />
          
          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-4 right-4 glass-dark p-2 rounded-full transition-colors ${
              isWishlisted ? 'text-red-500' : 'text-forest-600 hover:text-gold-500'
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Tags */}
          {plant.tags && plant.tags.length > 0 && (
            <div className="absolute bottom-4 left-4">
              <Badge className={`${getTagColor(plant.tags[0])} text-white`}>
                {plant.tags[0]}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <h3 className="font-sf text-xl font-semibold text-forest-600">
            {plant.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {plant.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-forest-600">
              ${plant.price.toFixed(2)}
            </div>
            {plant.rating && (
              <div className="flex items-center text-sm text-gray-500">
                <Star className="h-4 w-4 text-gold-400 fill-current mr-1" />
                <span>{plant.rating}</span>
                {plant.reviewCount && (
                  <span className="ml-1">({plant.reviewCount})</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || (plant.stock !== undefined && plant.stock <= 0)}
              className="flex-1 bg-forest-500 hover:bg-forest-600 text-white font-semibold transition-colors"
            >
              {isAddingToCart ? (
                'Adding...'
              ) : plant.stock !== undefined && plant.stock <= 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white transition-colors"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
