import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Shield, Users, Mail, FileText, Settings, Eye, Edit, Trash2, Plus, Upload, X } from 'lucide-react';
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
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newsletters, setNewsletters] = useState<NewsletterSubscriber[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);
  const [showPlantForm, setShowPlantForm] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({ displayName: '', password: '' });
  const [plantForm, setPlantForm] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    featured: false,
    categoryId: '',
    careInstructions: '',
    lightRequirement: '',
    wateringFrequency: '',
    difficultyLevel: '',
    tags: [] as string[],
    imageUrls: [] as string[]
  });

  // Check if admin is authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    setIsAuthenticated(isAuthenticated);
    setLoading(false);
    if (isAuthenticated) {
      loadAdminData();
    }
  }, []);

  const loadAdminData = async () => {
    try {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const headers = {
        'Content-Type': 'application/json',
        'x-admin-auth': adminAuth || 'true'
      };

      const [usersRes, newslettersRes, contentRes, plantsRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/newsletters', { headers }),
        fetch('/api/admin/content', { headers }),
        fetch('/api/admin/plants', { headers })
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
    try {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      loadAdminData();
      toast({
        title: "Success",
        description: "Admin access granted"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed",
        variant: "destructive"
      });
    }
  };

  const updateSiteContent = async (content: SiteContent) => {
    try {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const response = await fetch(`/api/admin/content/${content.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': adminAuth || 'true'
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
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const response = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': adminAuth || 'true'
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

  // Plant Management Functions
  const createPlant = async (plantData: any) => {
    try {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const response = await fetch('/api/admin/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': adminAuth || 'true'
        },
        body: JSON.stringify(plantData)
      });

      if (response.ok) {
        await loadAdminData();
        setShowPlantForm(false);
        setEditingPlant(null);
        resetPlantForm();
        toast({
          title: "Success",
          description: "Plant created successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create plant",
        variant: "destructive"
      });
    }
  };

  const updatePlant = async (plantId: string, plantData: any) => {
    try {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const response = await fetch(`/api/admin/plants/${plantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': adminAuth || 'true'
        },
        body: JSON.stringify(plantData)
      });

      if (response.ok) {
        await loadAdminData();
        setShowPlantForm(false);
        setEditingPlant(null);
        resetPlantForm();
        toast({
          title: "Success",
          description: "Plant updated successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plant",
        variant: "destructive"
      });
    }
  };

  const deletePlant = async (plantId: string) => {
    if (!confirm('Are you sure you want to delete this plant?')) return;
    
    try {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const response = await fetch(`/api/admin/plants/${plantId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': adminAuth || 'true'
        }
      });

      if (response.ok) {
        await loadAdminData();
        toast({
          title: "Success",
          description: "Plant deleted successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plant",
        variant: "destructive"
      });
    }
  };

  // User Management Functions
  const updateUser = async (userId: string, userData: any) => {
    try {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': adminAuth || 'true'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        await loadAdminData();
        setEditingUser(null);
        setUserForm({ displayName: '', password: '' });
        toast({
          title: "Success",
          description: "User updated successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const adminAuth = localStorage.getItem('adminAuthenticated');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-auth': adminAuth || 'true'
        }
      });

      if (response.ok) {
        await loadAdminData();
        toast({
          title: "Success",
          description: "User deleted successfully"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      });
    }
  };

  const resetPlantForm = () => {
    setPlantForm({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      featured: false,
      categoryId: '',
      careInstructions: '',
      lightRequirement: '',
      wateringFrequency: '',
      difficultyLevel: '',
      tags: [],
      imageUrls: []
    });
  };

  const handlePlantFormSubmit = async () => {
    if (editingPlant) {
      await updatePlant(editingPlant.id, plantForm);
    } else {
      await createPlant(plantForm);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminId');
    setIsAuthenticated(false);
    toast({
      title: "Success",
      description: "Logged out successfully"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Verde Luxe Admin Panel</h1>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
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
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => {
                      resetPlantForm();
                      setEditingPlant(null);
                      setShowPlantForm(true);
                    }}
                  >
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setEditingPlant(plant);
                              setPlantForm({
                                name: plant.name,
                                description: plant.description,
                                price: plant.price,
                                stock: plant.stock,
                                featured: plant.featured,
                                categoryId: plant.categoryId,
                                careInstructions: plant.careInstructions || '',
                                lightRequirement: plant.lightRequirement || '',
                                wateringFrequency: plant.wateringFrequency || '',
                                difficultyLevel: plant.difficultyLevel || '',
                                tags: plant.tags,
                                imageUrls: plant.imageUrls
                              });
                              setShowPlantForm(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deletePlant(plant.id)}
                          >
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
                          onClick={() => {
                            setEditingUser(adminUser);
                            setUserForm({ displayName: adminUser.displayName, password: '' });
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserAdmin(adminUser.id, adminUser.isAdmin)}
                        >
                          {adminUser.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteUser(adminUser.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
                <CardDescription>Edit About and Contact page content, including Vanessa Bagenzi's image</CardDescription>
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
                          <Textarea
                            className="min-h-32"
                            value={editingContent.content || ''}
                            onChange={(e) => setEditingContent({...editingContent, content: e.target.value})}
                            placeholder="Content"
                          />
                          
                          {/* Special image upload for Vanessa Bagenzi */}
                          {content.key === 'vanessa_bagenzi' && (
                            <div className="space-y-2">
                              <Label htmlFor="vanessa-image">Upload Vanessa's Image</Label>
                              <div className="flex items-center gap-4">
                                <Input
                                  id="vanessa-image"
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const formData = new FormData();
                                      formData.append('image', file);
                                      formData.append('type', 'profile');
                                      
                                      try {
                                        const adminAuth = localStorage.getItem('adminAuthenticated');
                                        const response = await fetch('/api/admin/upload-image', {
                                          method: 'POST',
                                          headers: {
                                            'x-admin-auth': adminAuth || 'true'
                                          },
                                          body: formData
                                        });
                                        
                                        if (response.ok) {
                                          const result = await response.json();
                                          // Update content with new image URL
                                          const updatedContent = editingContent.content?.replace(
                                            /\*\*Image:\*\*\s*.+/,
                                            `**Image:** ${result.imageUrl}`
                                          ) || editingContent.content + `\n\n**Image:** ${result.imageUrl}`;
                                          setEditingContent({...editingContent, content: updatedContent});
                                          
                                          toast({
                                            title: "Success",
                                            description: "Image uploaded successfully"
                                          });
                                        } else {
                                          throw new Error('Upload failed');
                                        }
                                      } catch (error) {
                                        console.error('Upload failed:', error);
                                        toast({
                                          title: "Error",
                                          description: "Failed to upload image",
                                          variant: "destructive"
                                        });
                                      }
                                    }
                                  }}
                                />
                                <div className="text-sm text-gray-500">
                                  Current: {editingContent.content?.match(/\*\*Image:\*\*\s*(.+)/)?.[1] || 'No image'}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400">
                                Upload an image for Vanessa Bagenzi's profile. The image URL will be added to the content automatically.
                              </div>
                            </div>
                          )}
                          
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
                          <p className="text-sm text-gray-600">{content.title}</p>
                          <p className="text-xs text-gray-500 mt-2 line-clamp-3">{content.content}</p>
                          
                          {/* Show current image for Vanessa Bagenzi */}
                          {content.key === 'vanessa_bagenzi' && content.content?.includes('**Image:**') && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-400 mb-1">Current image:</div>
                              <img 
                                src={content.content.match(/\*\*Image:\*\*\s*(.+)/)?.[1] || ''} 
                                alt="Vanessa Bagenzi"
                                className="w-16 h-16 rounded-full object-cover border"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
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
                  Settings
                </CardTitle>
                <CardDescription>System settings and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Plant Form Modal */}
        {showPlantForm && (
          <Dialog open={showPlantForm} onOpenChange={setShowPlantForm}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPlant ? 'Edit Plant' : 'Add New Plant'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Plant Name</Label>
                  <Input
                    id="name"
                    value={plantForm.name}
                    onChange={(e) => setPlantForm({...plantForm, name: e.target.value})}
                    placeholder="Enter plant name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={plantForm.description}
                    onChange={(e) => setPlantForm({...plantForm, description: e.target.value})}
                    placeholder="Enter plant description"
                  />
                </div>
                <div>
                  <Label htmlFor="images">Plant Images</Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || []);
                      if (files.length > 0) {
                        const imageUrls: string[] = [];
                        
                        for (const file of files) {
                          const formData = new FormData();
                          formData.append('image', file);
                          formData.append('type', 'plant');
                          
                          try {
                            const adminAuth = localStorage.getItem('adminAuthenticated');
                            const response = await fetch('/api/admin/upload-image', {
                              method: 'POST',
                              headers: {
                                'x-admin-auth': adminAuth || 'true'
                              },
                              body: formData
                            });
                            
                            if (response.ok) {
                              const result = await response.json();
                              imageUrls.push(result.imageUrl);
                            }
                          } catch (error) {
                            console.error('Upload failed:', error);
                          }
                        }
                        
                        setPlantForm({...plantForm, imageUrls: [...plantForm.imageUrls, ...imageUrls]});
                      }
                    }}
                  />
                  <div className="mt-2 text-sm text-gray-500">
                    Upload multiple images for this plant
                  </div>
                  {plantForm.imageUrls.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {plantForm.imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url} 
                            alt={`Plant ${index + 1}`}
                            className="w-16 h-16 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newUrls = plantForm.imageUrls.filter((_, i) => i !== index);
                              setPlantForm({...plantForm, imageUrls: newUrls});
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={plantForm.price}
                      onChange={(e) => setPlantForm({...plantForm, price: Number(e.target.value)})}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={plantForm.stock}
                      onChange={(e) => setPlantForm({...plantForm, stock: Number(e.target.value)})}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={plantForm.featured}
                    onCheckedChange={(checked) => setPlantForm({...plantForm, featured: checked})}
                  />
                  <Label htmlFor="featured">Featured Plant</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePlantFormSubmit}>
                    {editingPlant ? 'Update Plant' : 'Create Plant'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowPlantForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* User Edit Modal */}
        {editingUser && (
          <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={userForm.displayName}
                    onChange={(e) => setUserForm({...userForm, displayName: e.target.value})}
                    placeholder="Enter display name"
                  />
                </div>
                <div>
                  <Label htmlFor="password">New Password (optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => updateUser(editingUser.id, userForm)}>
                    Update User
                  </Button>
                  <Button variant="outline" onClick={() => setEditingUser(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default SecureAdmin;