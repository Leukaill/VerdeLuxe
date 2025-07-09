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
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Tropical Paradise",
      subtitle: "Lush tropical plants for your home"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1509937528-f993b3dafb37?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Modern Minimalist",
      subtitle: "Clean lines and elegant greenery"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      title: "Exotic Collection",
      subtitle: "Rare and luxurious plants for discerning collectors"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Orbital Slideshow Background */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 will-change-transform"
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              transform: 'translateZ(0)', // Force hardware acceleration
            }}
          />
        </AnimatePresence>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-700/80 to-forest-500/60" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {slides.map((slide, index) => {
            const isActive = index === currentSlide;
            const position = (index - currentSlide + slides.length) % slides.length;
            const angle = (position * 120) - 60; // -60, 60, 180 degrees
            const radius = 200;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius * 0.3;
            
            return (
              <motion.div
                key={`${slide.id}-${currentSlide}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: isActive ? 0.4 : 0.2,
                  scale: isActive ? 1 : 0.7,
                  x: x,
                  y: y,
                  rotateY: angle * 0.3,
                }}
                transition={{ 
                  duration: 1, 
                  ease: [0.4, 0, 0.2, 1],
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className="absolute right-1/2 top-1/2 w-24 h-36 rounded-xl overflow-hidden shadow-xl will-change-transform"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`,
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  transform: 'translateZ(0)', // Force hardware acceleration
                }}
              >
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ 
                    backgroundImage: `url(${slide.image})`,
                    transform: 'translateZ(0)',
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
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

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/80"
      >
        <span className="text-sm font-medium mb-2">Scroll to explore</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
      </motion.div>
      
      <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
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
