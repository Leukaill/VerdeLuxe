import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'wouter';
import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      title: "Tropical Paradise",
      subtitle: "Lush tropical plants for your home"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      title: "Modern Minimalist",
      subtitle: "Clean lines and elegant greenery"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
      title: "Garden Paradise",
      subtitle: "Transform your space into a sanctuary"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative pt-20 pb-16 overflow-hidden">
      {/* Orbital Slideshow Background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1, rotateZ: 5 }}
            animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateZ: -5 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 parallax-bg"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </AnimatePresence>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-700/80 to-forest-500/60" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            const offset = (index - currentSlide) * 120;
            
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 100 }}
                animate={{
                  opacity: isActive ? 0.3 : 0.1,
                  y: 0,
                  x: offset,
                  scale: isActive ? 1 : 0.8,
                  rotateY: offset * 0.5,
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-48 rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  background: `linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))`,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <div
                  className="w-full h-full bg-cover bg-center opacity-80"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-gold-400 shadow-lg shadow-gold-400/50'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-sf text-5xl lg:text-6xl font-bold leading-tight">
                  {slides[currentSlide].title}{' '}
                  <span className="text-gold-400">Collection</span>
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed">
                  {slides[currentSlide].subtitle}. Use our 3D visualization tool to see exactly how they'll transform your space.
                </p>
              </motion.div>
            </AnimatePresence>
            
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
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="text-white">
                      <h4 className="font-semibold">{slides[currentSlide].title}</h4>
                      <p className="text-gold-400 font-semibold">From $89.99</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
