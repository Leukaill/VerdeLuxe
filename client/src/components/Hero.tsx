import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';

const Hero = () => {
  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 parallax-bg"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-700/80 to-forest-500/60" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6"
          >
            <h1 className="font-sf text-5xl lg:text-6xl font-bold leading-tight">
              Bring Nature{' '}
              <span className="text-gold-400">Indoors</span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Discover our curated collection of premium plants. Use our 3D visualization tool to see exactly how they'll transform your space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 rounded-xl font-semibold transition-all glow-gold">
                  Explore Collection
                </Button>
              </Link>
              <Link href="/3d-studio">
                <Button
                  variant="outline"
                  className="glass border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all"
                >
                  Try 3D Studio
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass p-8 rounded-2xl animate-float"
          >
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-sf text-xl font-semibold text-white">Featured Today</h3>
                <div className="flex items-center space-x-4">
                  <img
                    src="https://images.unsplash.com/photo-1545241047-6083a3684587?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
                    alt="Monstera Deliciosa"
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="text-white">
                    <h4 className="font-semibold">Monstera Deliciosa</h4>
                    <p className="text-gold-400 font-semibold">$89.99</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
