import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';

const MobileModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const hasSeenModal = localStorage.getItem('hasSeenMobileModal');
    
    if (isMobile && !hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenMobileModal', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md glass">
        <div className="text-center space-y-6 py-4">
          <Smartphone className="h-16 w-16 text-forest-500 mx-auto" />
          <h3 className="font-sf text-2xl font-bold text-forest-600">Better on Desktop</h3>
          <p className="text-gray-600">
            For the best 3D visualization experience, we recommend using Verde Luxe on a desktop or tablet device.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 glass border border-gray-300 text-gray-600"
            >
              Continue Anyway
            </Button>
            <Button
              onClick={handleClose}
              className="flex-1 bg-forest-500 text-white"
            >
              Got It
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileModal;
