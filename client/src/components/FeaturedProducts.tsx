import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { Link } from 'wouter';

const featuredPlants = [
  {
    id: '1',
    name: 'Fiddle Leaf Fig',
    description: 'Large, glossy leaves that make a bold statement. Perfect for bright, indirect light.',
    price: 129.99,
    imageUrls: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'],
    rating: 4.8,
    reviewCount: 127,
    tags: ['Premium'],
    featured: true,
    stock: 15
  },
  {
    id: '2',
    name: 'Snake Plant',
    description: 'Architectural beauty with striking vertical leaves. Thrives in low light conditions.',
    price: 69.99,
    imageUrls: ['https://images.unsplash.com/photo-1509423350716-97f2360af70e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'],
    rating: 4.9,
    reviewCount: 203,
    tags: ['Low Light'],
    featured: true,
    stock: 23
  },
  {
    id: '3',
    name: 'Monstera Adansonii',
    description: 'Swiss cheese plant with unique perforated leaves. Perfect for hanging baskets.',
    price: 89.99,
    imageUrls: ['https://images.unsplash.com/photo-1545241047-6083a3684587?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'],
    rating: 4.7,
    reviewCount: 89,
    tags: ['Trending'],
    featured: true,
    stock: 18
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-sf text-4xl font-bold text-forest-600 mb-4"
        >
          Featured Plants
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-600 text-lg max-w-2xl mx-auto"
        >
          Handpicked premium plants that bring elegance and vitality to any space.
        </motion.p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredPlants.map((plant, index) => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ProductCard plant={plant} />
          </motion.div>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Link href="/products">
          <Button
            variant="outline"
            className="glass border border-forest-500 text-forest-600 hover:bg-forest-500 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all"
          >
            View All Plants
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProducts;
