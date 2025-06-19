import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Leaf, Search, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
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
      <nav className="fixed top-0 w-full z-50 glass">
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

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-forest-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 glass-dark rounded-b-lg">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-forest-600 hover:text-gold-500"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="flex items-center justify-around pt-4 border-t border-white/20">
                  <Button variant="ghost" size="icon" className="text-forest-600">
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-forest-600">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Link href="/cart">
                    <Button variant="ghost" size="icon" className="relative text-forest-600">
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {totalItems}
                        </span>
                      )}
                    </Button>
                  </Link>
                </div>

                <div className="pt-4">
                  {user ? (
                    <div className="space-y-2">
                      <Link href="/profile">
                        <Button variant="ghost" className="w-full text-forest-600">
                          {user.name || 'Profile'}
                        </Button>
                      </Link>
                      <Button
                        onClick={handleSignOut}
                        variant="outline"
                        className="w-full text-forest-600"
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-forest-500 text-white"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
