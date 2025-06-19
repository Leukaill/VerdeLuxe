import { useState } from 'react';
import { motion } from 'framer-motion';
import { Handshake, Users, Building, Globe, Mail, User, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Collab = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    partnershipType: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'collaboration_requests'), {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });
      
      toast({
        title: "Partnership request sent!",
        description: "We'll review your proposal and get back to you within 2-3 business days"
      });
      
      setFormData({
        name: '',
        email: '',
        organization: '',
        partnershipType: '',
        message: ''
      });
    } catch (error) {
      console.error('Partnership request error:', error);
      toast({
        title: "Request failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-forest-50 to-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-forest-800 mb-6">
              Partner With Us
            </h1>
            <p className="text-xl text-forest-600 leading-relaxed">
              Join our mission to bring more greenery to Rwanda and beyond. Let's grow together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-forest-800 mb-6">
              Partnership Opportunities
            </h2>
            <p className="text-xl text-forest-600 max-w-3xl mx-auto">
              We believe in the power of collaboration. Whether you're a nursery, landscaper, 
              educational institution, or business, there's a way we can work together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Building,
                title: "Nursery Partners",
                description: "Local nurseries can join our network to reach more customers and expand their market presence."
              },
              {
                icon: Users,
                title: "Corporate Wellness",
                description: "Partner with us to bring plants to your workplace and improve employee well-being."
              },
              {
                icon: Globe,
                title: "Educational Programs",
                description: "Schools and universities can collaborate on plant education and sustainability initiatives."
              },
              {
                icon: Handshake,
                title: "Community Projects",
                description: "NGOs and community organizations can work with us on green space development projects."
              }
            ].map((opportunity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
              >
                <Card className="glass border-0 h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-forest-500 to-sage-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <opportunity.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-forest-800 mb-4">
                      {opportunity.title}
                    </h3>
                    <p className="text-forest-600">
                      {opportunity.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-sage-50 to-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-forest-800">
                Why Partner With PlantShop?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-forest-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-forest-800">Growing Market</h3>
                    <p className="text-forest-600">Access to Rwanda's expanding urban plant market and eco-conscious consumers.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-forest-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-forest-800">Technology Platform</h3>
                    <p className="text-forest-600">Leverage our innovative online platform and 3D visualization technology.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-forest-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-forest-800">Shared Values</h3>
                    <p className="text-forest-600">Join a mission-driven company focused on sustainability and community impact.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-forest-500 rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-forest-800">Marketing Support</h3>
                    <p className="text-forest-600">Benefit from our digital marketing expertise and growing brand recognition.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-6"
            >
              <Card className="glass border-0">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-forest-800 mb-6">
                    Partnership Success Stories
                  </h3>
                  <div className="space-y-6">
                    <div className="border-l-4 border-forest-500 pl-4">
                      <p className="text-forest-600 italic mb-2">
                        "Partnering with PlantShop has doubled our reach to urban customers. 
                        Their platform makes it easy for us to showcase our plants to a wider audience."
                      </p>
                      <p className="text-sm font-semibold text-forest-800">
                        - Green Gardens Nursery, Kigali
                      </p>
                    </div>
                    <div className="border-l-4 border-sage-500 pl-4">
                      <p className="text-forest-600 italic mb-2">
                        "The corporate wellness program has transformed our office environment. 
                        Employee satisfaction has increased significantly since we added plants."
                      </p>
                      <p className="text-sm font-semibold text-forest-800">
                        - TechHub Rwanda
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partnership Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-forest-800 mb-6">
              Start Your Partnership Journey
            </h2>
            <p className="text-xl text-forest-600">
              Tell us about your organization and how you'd like to collaborate. 
              We'll get back to you within 2-3 business days.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Card className="glass border-0">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Full Name *
                      </Label>
                      <div className="mt-1 relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                          className="pl-10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <div className="mt-1 relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Enter your email"
                          className="pl-10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="organization" className="text-sm font-medium text-gray-700">
                        Organization/Company
                      </Label>
                      <div className="mt-1 relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="organization"
                          type="text"
                          value={formData.organization}
                          onChange={(e) => handleInputChange('organization', e.target.value)}
                          placeholder="Enter organization name"
                          className="pl-10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="partnershipType" className="text-sm font-medium text-gray-700">
                        Partnership Type
                      </Label>
                      <div className="mt-1 relative">
                        <Handshake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="partnershipType"
                          type="text"
                          value={formData.partnershipType}
                          onChange={(e) => handleInputChange('partnershipType', e.target.value)}
                          placeholder="e.g., Nursery, Corporate, Educational"
                          className="pl-10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Partnership Proposal *
                    </Label>
                    <div className="mt-1 relative">
                      <MessageSquare className="absolute left-3 top-4 text-gray-400 h-4 w-4" />
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        placeholder="Tell us about your organization, your goals, and how you'd like to partner with us..."
                        className="pl-10 min-h-32"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-forest-500 to-sage-500 hover:from-forest-600 hover:to-sage-600 text-white py-3 text-lg font-semibold"
                  >
                    {isSubmitting ? 'Submitting Partnership Request...' : 'Submit Partnership Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Collab;