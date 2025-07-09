import { useState, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { Leaf, Search, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import AuthModal from './AuthModal';
import AdminModal from './AdminModal';

const Navbar = () => {
  const [location, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  // Admin access state
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Collab', href: '/collab' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Admin access handlers
  const handleLogoMouseDown = () => {
    setIsPressed(true);
    pressTimer.current = setTimeout(() => {
      setIsAdminModalOpen(true);
      toast({
        title: "Admin Access",
        description: "Opening admin authentication",
      });
    }, 3000); // 3 seconds
  };

  const handleLogoMouseUp = () => {
    setIsPressed(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleLogoMouseLeave = () => {
    setIsPressed(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 w-full z-50 glass hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with hidden admin access */}
            <div 
              className="flex items-center space-x-2 cursor-pointer select-none"
              onMouseDown={handleLogoMouseDown}
              onMouseUp={handleLogoMouseUp}
              onMouseLeave={handleLogoMouseLeave}
              onTouchStart={handleLogoMouseDown}
              onTouchEnd={handleLogoMouseUp}
              onClick={(e) => {
                if (!isPressed) {
                  setLocation('/');
                }
                e.preventDefault();
              }}
            >
              <motion.div
                animate={{
                  scale: isPressed ? 1.1 : 1,
                  rotateY: isPressed ? 360 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <Leaf className={`text-2xl transition-colors ${isPressed ? 'text-gold-500' : 'text-forest-500'}`} />
              </motion.div>
              <span className={`font-sf font-bold text-xl transition-colors ${isPressed ? 'text-gold-500' : 'text-forest-600'}`}>
                Verde Luxe
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-forest-600 hover:text-gold-500 transition-colors ${
                    location === item.href ? 'text-gold-500' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search plants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                    autoFocus
                  />
                  <Button type="submit" size="sm" className="bg-forest-500 hover:bg-forest-600 text-white">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-forest-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-forest-600 hover:text-gold-500"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
              
              <Button variant="ghost" size="icon" className="relative text-forest-600 hover:text-gold-500">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Button>

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative text-forest-600 hover:text-gold-500">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {user ? (
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <Button variant="ghost" className="text-forest-600">
                      {user.name || 'Profile'}
                    </Button>
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="glass-dark text-forest-600 hover:bg-forest-500 hover:text-white"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="glass-dark text-forest-600 hover:bg-forest-500 hover:text-white"
                >
                  Sign In
                </Button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Dynamic Island Navbar */}
      <div className="md:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50">
        {/* Dynamic Island Container */}
        <motion.div
          animate={{
            width: isMenuOpen ? "90vw" : isMobileSearchOpen ? "85vw" : "200px",
            height: isMenuOpen ? "auto" : isMobileSearchOpen ? "120px" : "50px",
          }}
          transition={{ 
            duration: 0.4, 
            ease: [0.4, 0, 0.2, 1],
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="relative"
        >
          {/* Main Dynamic Island */}
          <motion.div
            className="relative overflow-hidden shadow-2xl"
            style={{
              background: `
                linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.25) 0%,
                  rgba(255, 255, 255, 0.15) 25%,
                  rgba(255, 255, 255, 0.05) 50%,
                  rgba(0, 0, 0, 0.1) 75%,
                  rgba(0, 0, 0, 0.2) 100%
                ),
                linear-gradient(45deg,
                  rgba(255, 255, 255, 0.1) 0%,
                  rgba(255, 255, 255, 0.05) 100%
                ),
                rgba(0, 0, 0, 0.3)
              `,
              backdropFilter: 'blur(20px) saturate(1.8)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.4),
                0 4px 16px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(0, 0, 0, 0.2)
              `,
            }}
            animate={{
              borderRadius: isMenuOpen ? "24px" : isMobileSearchOpen ? "20px" : "25px",
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Glass Reflection Effects */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Top highlight */}
              <div 
                className="absolute top-0 left-0 right-0 h-1/2 opacity-30"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 70%, transparent 100%)',
                  borderRadius: 'inherit',
                }}
              />
              {/* Bottom shadow */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1/3 opacity-20"
                style={{
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
                  borderRadius: 'inherit',
                }}
              />
              {/* Side highlights */}
              <div 
                className="absolute top-1/4 left-0 w-px h-1/2 bg-white/20"
                style={{ borderRadius: '1px' }}
              />
              <div 
                className="absolute top-1/4 right-0 w-px h-1/2 bg-black/20"
                style={{ borderRadius: '1px' }}
              />
            </div>
            {/* Collapsed State */}
            <AnimatePresence>
              {!isMenuOpen && !isMobileSearchOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between px-4 py-3"
                >
                  {/* Logo */}
                  <Link href="/" className="flex items-center space-x-2">
                    <Leaf className="text-green-400 w-5 h-5" />
                    <span className="font-sf font-bold text-sm text-white">Verde</span>
                  </Link>

                  {/* Action Icons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setIsMenuOpen(true)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <Menu className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Search State */}
            <AnimatePresence>
              {isMobileSearchOpen && !isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="p-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Search className="text-green-400 w-5 h-5" />
                      <span className="font-sf font-bold text-sm text-white">Search Plants</span>
                    </div>
                    
                    <button
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="text-white/80 hover:text-white transition-colors p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Search Form */}
                  <form onSubmit={handleSearch} className="relative">
                    <input
                      type="text"
                      placeholder="Search for plants..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-10 text-white placeholder-white/60 focus:outline-none transition-all duration-300"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.15) 0%,
                            rgba(255, 255, 255, 0.05) 100%
                          )
                        `,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        boxShadow: `
                          inset 0 1px 0 rgba(255, 255, 255, 0.2),
                          inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                          0 4px 8px rgba(0, 0, 0, 0.1)
                        `,
                      }}
                      onFocus={(e) => {
                        e.target.style.boxShadow = `
                          inset 0 1px 0 rgba(255, 255, 255, 0.3),
                          inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                          0 0 0 2px rgba(34, 197, 94, 0.3),
                          0 4px 12px rgba(0, 0, 0, 0.2)
                        `;
                      }}
                      onBlur={(e) => {
                        e.target.style.boxShadow = `
                          inset 0 1px 0 rgba(255, 255, 255, 0.2),
                          inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                          0 4px 8px rgba(0, 0, 0, 0.1)
                        `;
                      }}
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                    
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg text-black font-medium text-sm transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 1) 0%, rgba(22, 163, 74, 1) 100%)',
                          boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        Go
                      </motion.button>
                    )}
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expanded State */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="p-6"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="flex items-center space-x-2">
                      <Leaf className="text-green-400 w-6 h-6" />
                      <span className="font-sf font-bold text-lg text-white">Verde Luxe</span>
                    </Link>
                    
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="text-white/80 hover:text-white transition-colors p-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="mb-6">
                    <form onSubmit={handleSearch} className="relative">
                      <input
                        type="text"
                        placeholder="Search plants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 pl-10 text-white placeholder-white/60 focus:outline-none transition-all duration-300"
                        style={{
                          background: `
                            linear-gradient(135deg, 
                              rgba(255, 255, 255, 0.15) 0%,
                              rgba(255, 255, 255, 0.05) 100%
                            )
                          `,
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          boxShadow: `
                            inset 0 1px 0 rgba(255, 255, 255, 0.2),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                            0 4px 8px rgba(0, 0, 0, 0.1)
                          `,
                        }}
                        onFocus={(e) => {
                          e.target.style.boxShadow = `
                            inset 0 1px 0 rgba(255, 255, 255, 0.3),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                            0 0 0 2px rgba(34, 197, 94, 0.3),
                            0 4px 12px rgba(0, 0, 0, 0.2)
                          `;
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = `
                            inset 0 1px 0 rgba(255, 255, 255, 0.2),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1),
                            0 4px 8px rgba(0, 0, 0, 0.1)
                          `;
                        }}
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
                    </form>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1 mb-6">
                    {navigation.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block px-4 py-3 rounded-xl text-white/90 hover:text-white transition-all duration-300 ${
                            location === item.href ? 'text-green-400' : ''
                          }`}
                          style={location === item.href ? {
                            background: `
                              linear-gradient(135deg, 
                                rgba(34, 197, 94, 0.3) 0%,
                                rgba(34, 197, 94, 0.1) 100%
                              )
                            `,
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            boxShadow: `
                              inset 0 1px 0 rgba(34, 197, 94, 0.4),
                              0 2px 8px rgba(34, 197, 94, 0.1)
                            `,
                          } : {}}
                          onMouseEnter={(e) => {
                            if (location !== item.href) {
                              e.currentTarget.style.background = `
                                linear-gradient(135deg, 
                                  rgba(255, 255, 255, 0.15) 0%,
                                  rgba(255, 255, 255, 0.05) 100%
                                )
                              `;
                              e.currentTarget.style.backdropFilter = 'blur(8px)';
                              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (location !== item.href) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.backdropFilter = 'none';
                              e.currentTarget.style.border = '1px solid transparent';
                            }
                          }}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-around py-4 mb-4">
                    <div 
                      className="h-px flex-1"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-around mb-6">
                    <button 
                      className="flex flex-col items-center space-y-1 text-white/80 hover:text-white transition-all duration-300 p-3 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Heart className="w-5 h-5" />
                      <span className="text-xs">Wishlist</span>
                    </button>
                    
                    <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                      <button 
                        className="flex flex-col items-center space-y-1 text-white/80 hover:text-white transition-all duration-300 relative p-3 rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        <span className="text-xs">Cart</span>
                        {totalItems > 0 && (
                          <span 
                            className="absolute -top-1 -right-1 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                            style={{
                              background: 'linear-gradient(135deg, rgba(34, 197, 94, 1) 0%, rgba(22, 163, 74, 1) 100%)',
                              boxShadow: '0 2px 4px rgba(34, 197, 94, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                            }}
                          >
                            {totalItems}
                          </span>
                        )}
                      </button>
                    </Link>
                    
                    <Link href="/3d-studio" onClick={() => setIsMenuOpen(false)}>
                      <button 
                        className="flex flex-col items-center space-y-1 text-white/80 hover:text-white transition-all duration-300 p-3 rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <div className="w-5 h-5 border border-current rounded"></div>
                        <span className="text-xs">3D View</span>
                      </button>
                    </Link>
                  </div>

                  {/* User Actions */}
                  <div className="pt-2">
                    {user ? (
                      <div className="space-y-3">
                        <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                          <button 
                            className="w-full text-left px-4 py-3 rounded-xl text-white transition-all duration-300"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.25), 0 4px 12px rgba(0, 0, 0, 0.1)',
                            }}
                          >
                            👋 {user.name || 'Profile'}
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl text-red-300 transition-all duration-300"
                          style={{
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            boxShadow: 'inset 0 1px 0 rgba(239, 68, 68, 0.2), 0 4px 12px rgba(239, 68, 68, 0.1)',
                          }}
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setIsAuthModalOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full px-4 py-3 rounded-xl text-black font-semibold transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 1) 0%, rgba(22, 163, 74, 1) 100%)',
                          boxShadow: `
                            0 4px 16px rgba(34, 197, 94, 0.3),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                          `,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = `
                            0 6px 20px rgba(34, 197, 94, 0.4),
                            inset 0 1px 0 rgba(255, 255, 255, 0.4),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                          `;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = `
                            0 4px 16px rgba(34, 197, 94, 0.3),
                            inset 0 1px 0 rgba(255, 255, 255, 0.3),
                            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                          `;
                        }}
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </>
  );
};

export default Navbar;
