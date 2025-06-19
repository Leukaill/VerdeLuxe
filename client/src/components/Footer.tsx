import { Leaf } from 'lucide-react';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    alert('Newsletter subscription would be implemented here');
  };

  return (
    <footer className="bg-forest-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Leaf className="text-gold-400 text-2xl" />
              <span className="font-sf font-bold text-xl">Verde Luxe</span>
            </div>
            <p className="text-gray-300">
              Bringing premium plants and innovative technology together for the ultimate plant shopping experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-gold-400 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold-400 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-gold-400 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
            </div>
          </div>
          
          {/* Collections */}
          <div>
            <h4 className="font-sf font-semibold text-lg mb-4">Collections</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/products?category=houseplants" className="hover:text-gold-400 transition-colors">
                  Houseplants
                </Link>
              </li>
              <li>
                <Link href="/products?category=office" className="hover:text-gold-400 transition-colors">
                  Office Plants
                </Link>
              </li>
              <li>
                <Link href="/products?category=exotic" className="hover:text-gold-400 transition-colors">
                  Exotic Plants
                </Link>
              </li>
              <li>
                <Link href="/products?category=garden" className="hover:text-gold-400 transition-colors">
                  Garden Plants
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="font-sf font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-gold-400 transition-colors">Plant Care Guide</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-gold-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-sf font-semibold text-lg mb-4">Newsletter</h4>
            <p className="text-gray-300 mb-4">Get plant care tips and exclusive offers.</p>
            <form onSubmit={handleSubscribe} className="flex">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-l-lg bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
              <Button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 px-6 rounded-r-lg font-semibold"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300">&copy; 2024 Verde Luxe. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-300 hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-300 hover:text-gold-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
