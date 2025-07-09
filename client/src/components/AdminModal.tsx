import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminModal = ({ isOpen, onClose }: AdminModalProps) => {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [adminPassword, setAdminPassword] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkAdminExists();
    }
  }, [isOpen]);

  const checkAdminExists = async () => {
    try {
      // Use the new Firestore-based admin check
      const { checkAdminExists: firestoreCheckAdmin } = await import('../lib/firebase');
      const adminExists = await firestoreCheckAdmin();
      setHasAdmin(adminExists);
    } catch (error) {
      console.error('Error checking admin existence:', error);
      setHasAdmin(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminEmail.trim() || !adminPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter admin email and password",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use the new Firestore-based admin verification
      const { verifyAdminCredentials } = await import('../lib/firebase');
      const adminData = await verifyAdminCredentials(adminEmail, adminPassword);

      if (adminData) {
        // Store admin session
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminEmail', adminEmail);
        localStorage.setItem('adminId', adminData.id);
        toast({
          title: "Success",
          description: "Admin access granted"
        });
        onClose();
        setLocation('/secure-admin-panel-verde-luxe');
      } else {
        toast({
          title: "Error",
          description: "Invalid admin credentials",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminEmail.trim() || !newAdminPassword.trim() || !confirmPassword.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    if (newAdminPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    if (newAdminPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Use the new Firestore-based admin creation
      const { createAdminCredentials } = await import('../lib/firebase');
      const adminDoc = await createAdminCredentials(adminEmail, newAdminPassword);

      if (adminDoc) {
        toast({
          title: "Success",
          description: "Admin account created successfully"
        });
        setHasAdmin(true);
        setIsCreatingAdmin(false);
        // Auto-login after creation
        localStorage.setItem('adminAuthenticated', 'true');
        localStorage.setItem('adminEmail', adminEmail);
        localStorage.setItem('adminId', adminDoc.id);
        onClose();
        setLocation('/secure-admin-panel-verde-luxe');
      }
    } catch (error: any) {
      console.error('Create admin error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin account",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAdminPassword('');
    setNewAdminPassword('');
    setConfirmPassword('');
    setAdminEmail('');
    setIsCreatingAdmin(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Shield className="text-forest-500" />
            Admin Access
          </DialogTitle>
        </DialogHeader>

        {hasAdmin === null ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-500"></div>
          </div>
        ) : hasAdmin ? (
          // Admin exists - show login form
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Admin Login</CardTitle>
              <CardDescription>
                Enter your admin password to access the control panel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="email"
                placeholder="Admin email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Admin password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
              />
              <Button 
                onClick={handleAdminLogin}
                disabled={isLoading || !adminPassword.trim() || !adminEmail.trim()}
                className="w-full bg-forest-500 hover:bg-forest-600"
              >
                {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          // No admin exists - show creation form
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="text-forest-500" />
                Create Admin Account
              </CardTitle>
              <CardDescription>
                No admin account exists. You can create the first and only admin account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Admin email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Create admin password (min 8 characters)"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirm admin password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateAdmin()}
                />
              </div>
              <Button 
                onClick={handleCreateAdmin}
                disabled={isLoading || !newAdminPassword.trim() || !confirmPassword.trim() || !adminEmail.trim()}
                className="w-full bg-forest-500 hover:bg-forest-600"
              >
                {isLoading ? 'Creating Admin...' : 'Create Admin Account'}
              </Button>
              <p className="text-sm text-gray-600 text-center">
                Note: Only one admin account can exist per system
              </p>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AdminModal;