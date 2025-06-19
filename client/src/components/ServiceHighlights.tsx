import { motion } from 'framer-motion';
import { Leaf, Box, Truck } from 'lucide-react';

const services = [
  {
    icon: Leaf,
    title: 'Premium Quality',
    description: 'Hand-selected plants from certified growers, ensuring the highest quality and health.'
  },
  {
    icon: Box,
    title: '3D Visualization',
    description: 'Revolutionary technology to preview plants in your space before purchasing.'
  },
  {
    icon: Truck,
    title: 'Expert Delivery',
    description: 'Specialized plant delivery service ensuring your plants arrive in perfect condition.'
  }
];

const ServiceHighlights = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-forest-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-sf text-4xl font-bold text-forest-600 mb-4"
          >
            Why Choose Verde Luxe
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            Premium quality, expert care, and innovative technology combine to bring you the finest plant shopping experience.
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="glass w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <IconComponent className="h-8 w-8 text-forest-500" />
                </div>
                <h3 className="font-sf text-xl font-semibold text-forest-600">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;
