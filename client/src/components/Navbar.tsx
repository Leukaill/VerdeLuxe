import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Leaf, Search, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [location, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 w-full z-50 glass hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Leaf className="text-forest-500 text-2xl" />
              <span className="font-sf font-bold text-xl text-forest-600">Verde Luxe</span>
            </Link>

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
            width: isMenuOpen ? "90vw" : "200px",
            height: isMenuOpen ? "auto" : "50px",
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
            className="bg-black/90 backdrop-blur-xl rounded-full shadow-xl border border-white/10"
            animate={{
              borderRadius: isMenuOpen ? "24px" : "25px",
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Collapsed State */}
            <AnimatePresence>
              {!isMenuOpen && (
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
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
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
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
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
                          className={`block px-4 py-3 rounded-xl text-white/90 hover:text-white hover:bg-white/10 transition-all ${
                            location === item.href ? 'bg-green-400/20 text-green-400' : ''
                          }`}
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-around py-4 border-t border-white/20 mb-4">
                    <button className="flex flex-col items-center space-y-1 text-white/80 hover:text-white transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="text-xs">Wishlist</span>
                    </button>
                    
                    <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                      <button className="flex flex-col items-center space-y-1 text-white/80 hover:text-white transition-colors relative">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="text-xs">Cart</span>
                        {totalItems > 0 && (
                          <span className="absolute -top-1 -right-1 bg-green-400 text-black text-xs rounded-full h-4 w-4 flex items-center justify-center">
                            {totalItems}
                          </span>
                        )}
                      </button>
                    </Link>
                    
                    <Link href="/3d-studio" onClick={() => setIsMenuOpen(false)}>
                      <button className="flex flex-col items-center space-y-1 text-white/80 hover:text-white transition-colors">
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
                          <button className="w-full text-left px-4 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors">
                            👋 {user.name || 'Profile'}
                          </button>
                        </Link>
                        <button
                          onClick={() => {
                            handleSignOut();
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
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
                        className="w-full px-4 py-3 rounded-xl bg-green-400 text-black font-semibold hover:bg-green-300 transition-colors"
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
    </>
  );
};

export default Navbar;
