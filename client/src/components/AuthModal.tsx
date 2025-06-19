import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSimpleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast({
        title: "Missing information",
        description: "Please enter both your name and email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, name);
      onClose();
      setEmail('');
      setName('');
      toast({
        title: "Welcome!",
        description: "You have been signed in successfully"
      });
    } catch (error) {
      console.error('Sign in failed:', error);
      toast({
        title: "Sign in failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-sf font-bold text-forest-600">
            Welcome to Verde Luxe
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSimpleSignIn} className="space-y-6 py-4">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              Sign in to access your account, save your wishlist, and track your orders.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-forest-500 hover:bg-forest-600 text-white py-3"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;