import { motion } from 'framer-motion';
import { Box, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const ThreeDVisualization = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-forest-500 to-forest-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6"
          >
            <h2 className="font-sf text-4xl font-bold">Visualize Before You Buy</h2>
            <p className="text-gray-200 text-lg">
              Our revolutionary 3D visualization tool lets you place plants in your actual space. Upload a photo of your room and see exactly how each plant will look.
            </p>
            <ul className="space-y-3 text-gray-200">
              <li className="flex items-center">
                <CheckCircle className="text-gold-400 mr-3 h-5 w-5" />
                Realistic 3D plant models
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-gold-400 mr-3 h-5 w-5" />
                AR integration for mobile devices
              </li>
              <li className="flex items-center">
                <CheckCircle className="text-gold-400 mr-3 h-5 w-5" />
                Save and share your designs
              </li>
            </ul>
            <Link href="/3d-studio">
              <Button className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-xl font-semibold transition-all glow-gold">
                Try 3D Studio Now
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl h-80 flex items-center justify-center">
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Box className="text-4xl text-forest-500 h-12 w-12 mx-auto" />
                </motion.div>
                <p className="text-forest-600 font-semibold">3D Visualization Preview</p>
                <p className="text-gray-600 text-sm">Interactive plant placement tool</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDVisualization;
