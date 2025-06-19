import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const categories = [
  {
    id: 'houseplants',
    name: 'Houseplants',
    description: 'Transform your living space with our premium indoor collection.',
    imageUrl: 'https://images.unsplash.com/photo-1463154545680-d59320fd685d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    slug: 'houseplants'
  },
  {
    id: 'office',
    name: 'Office Plants',
    description: 'Boost productivity with air-purifying workspace greenery.',
    imageUrl: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    slug: 'office'
  },
  {
    id: 'exotic',
    name: 'Exotic Plants',
    description: 'Rare and extraordinary specimens for the discerning collector.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    slug: 'exotic'
  },
  {
    id: 'garden',
    name: 'Garden Plants',
    description: 'Create stunning outdoor spaces with our garden collection.',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300',
    slug: 'garden'
  }
];

const CategoryGrid = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-sf text-4xl font-bold text-forest-600 mb-4"
        >
          Plant Categories
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-gray-600 text-lg max-w-2xl mx-auto"
        >
          From statement houseplants to office greenery, find the perfect botanical companion for every space.
        </motion.p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            className="glass rounded-2xl p-6 hover-lift cursor-pointer group"
          >
            <Link href={`/products?category=${category.slug}`}>
              <div>
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-105 transition-transform"
                />
                <h3 className="font-sf text-xl font-semibold text-forest-600 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-gold-500 font-semibold">
                  <span>Explore</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
