import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';
import { Link } from 'wouter';
import { getPlants } from '@/lib/firebase';

const FeaturedProducts = () => {
  const [featuredPlants, setFeaturedPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPlants = async () => {
      try {
        console.log('Fetching featured plants from database...');
        const plants = await getPlants(undefined, true); // Get featured plants
        console.log('Featured plants fetched:', plants);
        
        if (plants && plants.length > 0) {
          setFeaturedPlants(plants.slice(0, 6)); // Show up to 6 featured plants
        } else {
          // Fallback to all plants if no featured plants
          console.log('No featured plants found, fetching all plants...');
          const allPlants = await getPlants();
          console.log('All plants fetched:', allPlants);
          setFeaturedPlants(allPlants.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching featured plants:', error);
        setFeaturedPlants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPlants();
  }, []);

  if (loading) {
    return (
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sf text-4xl font-bold text-forest-600 mb-4">
            Featured Plants
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Handpicked premium plants that bring elegance and vitality to any space.
          </p>
        </div>
        
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-500"></div>
        </div>
      </section>
    );
  }

  if (featuredPlants.length === 0) {
    return (
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sf text-4xl font-bold text-forest-600 mb-4">
            Featured Plants
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Handpicked premium plants that bring elegance and vitality to any space.
          </p>
        </div>
        
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">
            No plants available at the moment. Check back soon!
          </p>
        </div>
      </section>
    );
  }

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
