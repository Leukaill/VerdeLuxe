import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Shield, Users, Mail, FileText, Settings, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  createdAt: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribed: boolean;
  createdAt: string;
}

interface SiteContent {
  id: string;
  key: string;
  title?: string;
  content?: string;
  updatedAt: string;
}

interface Plant {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrls: string[];
  stock: number;
  featured: boolean;
  tags: string[];
  careInstructions?: string;
  lightRequirement?: string;
  wateringFrequency?: string;
  difficultyLevel?: string;
  rating?: number;
  reviewCount?: number;
  threeDModelUrl?: string;
  isActive: boolean;
  createdAt: string;
}

const SecureAdmin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterSubscriber[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/admin/check-status', {
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.isAdmin) {
            setIsAuthenticated(true);
            loadAdminData();
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const loadAdminData = async () => {
    try {
      const [usersRes, newslettersRes, contentRes, plantsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/newsletters'),
        fetch('/api/admin/content'),
        fetch('/api/admin/plants')
      ]);

      if (usersRes.ok) setUsers(await usersRes.json());
      if (newslettersRes.ok) setNewsletters(await newslettersRes.json());
      if (contentRes.ok) setSiteContent(await contentRes.json());
      if (plantsRes.ok) setPlants(await plantsRes.json());
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      });
    }
  };

  const handleAdminAuth = async () => {
    if (adminPassword === 'verde-luxe-admin-2025') {
      try {
        const response = await fetch('/api/admin/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user?.getIdToken()}`
          },
          body: JSON.stringify({ password: adminPassword })
        });

        if (response.ok) {
          setIsAuthenticated(true);
          loadAdminData();
          toast({
            title: "Success",
            description: "Admin access granted"
          });
        } else {
          toast({
            title: "Error",
            description: "Invalid admin credentials",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Authentication failed",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Invalid admin password",
        variant: "destructive"
      });
    }
  };

  const updateSiteContent = async (content: SiteContent) => {
    try {
      const response = await fetch(`/api/admin/content/${content.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({
          title: content.title,
          content: content.content
        })
      });

      if (response.ok) {
        await loadAdminData();
        setEditingContent(null);
        toast({
          title: "Success",
          description: "Content updated successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive"
      });
    }
  };

  const toggleUserAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`
        },
        body: JSON.stringify({ isAdmin: !isAdmin })
      });

      if (response.ok) {
        await loadAdminData();
        toast({
          title: "Success",
          description: `User admin status ${!isAdmin ? 'granted' : 'revoked'}`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription>Please log in to continue</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              <CardTitle>Admin Access</CardTitle>
            </div>
            <CardDescription>Enter admin credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
            />
            <Button onClick={handleAdminAuth} className="w-full">
              Authenticate
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">Verde Luxe Admin Panel</h1>
        </div>

        <Tabs defaultValue="plants" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="plants">Plants</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="plants" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Plant Management
                </CardTitle>
                <CardDescription>Manage your plant inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Plant
                  </Button>
                  <div className="space-y-2">
                    {plants.map((plant) => (
                      <div key={plant.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{plant.name}</h3>
                          <p className="text-sm text-gray-600">${plant.price} • Stock: {plant.stock}</p>
                          <div className="flex gap-2 mt-2">
                            {plant.featured && <Badge variant="secondary">Featured</Badge>}
                            {!plant.isActive && <Badge variant="destructive">Inactive</Badge>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage registered users and admin access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.map((adminUser) => (
                    <div key={adminUser.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{adminUser.displayName}</h3>
                        <p className="text-sm text-gray-600">{adminUser.email}</p>
                        <p className="text-xs text-gray-500">Joined: {new Date(adminUser.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {adminUser.isAdmin && <Badge>Admin</Badge>}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserAdmin(adminUser.id, adminUser.isAdmin)}
                        >
                          {adminUser.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Newsletter Subscribers
                </CardTitle>
                <CardDescription>Manage newsletter subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {newsletters.map((subscriber) => (
                    <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{subscriber.name || 'Anonymous'}</h3>
                        <p className="text-sm text-gray-600">{subscriber.email}</p>
                        <p className="text-xs text-gray-500">Subscribed: {new Date(subscriber.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={subscriber.subscribed ? "default" : "secondary"}>
                          {subscriber.subscribed ? 'Subscribed' : 'Unsubscribed'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Site Content Management
                </CardTitle>
                <CardDescription>Edit About and Contact page content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {siteContent.map((content) => (
                    <div key={content.id} className="border rounded-lg p-4">
                      {editingContent?.id === content.id ? (
                        <div className="space-y-4">
                          <Input
                            value={editingContent.title || ''}
                            onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
                            placeholder="Title"
                          />
                          <textarea
                            className="w-full min-h-32 p-2 border rounded"
                            value={editingContent.content || ''}
                            onChange={(e) => setEditingContent({...editingContent, content: e.target.value})}
                            placeholder="Content"
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => updateSiteContent(editingContent)}>
                              Save
                            </Button>
                            <Button variant="outline" onClick={() => setEditingContent(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold capitalize">{content.key.replace('_', ' ')}</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingContent(content)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          {content.title && <h4 className="font-medium mb-2">{content.title}</h4>}
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">{content.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Last updated: {new Date(content.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Admin Settings
                </CardTitle>
                <CardDescription>System configuration and admin tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Current Admin</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <Badge className="mt-2">Active Admin</Badge>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Statistics</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Total Users: {users.length}</div>
                      <div>Newsletter Subscribers: {newsletters.filter(s => s.subscribed).length}</div>
                      <div>Active Plants: {plants.filter(p => p.isActive).length}</div>
                      <div>Featured Plants: {plants.filter(p => p.featured).length}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecureAdmin;