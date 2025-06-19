import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Contact = () => {
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
              Contact Us
            </h1>
            <p className="text-xl text-forest-600 leading-relaxed">
              Get in touch with our plant experts. We're here to help you grow your green paradise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Map */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-forest-800 mb-6">
                  Get in Touch
                </h2>
                <p className="text-forest-600 text-lg mb-8">
                  Visit our store in Kigali or contact us through any of the channels below. 
                  Our plant specialists are ready to help you find the perfect plants for your space.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="glass border-0">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-forest-500 to-sage-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest-800">Address</h3>
                      <p className="text-forest-600">
                        KG 15 Ave, Nyarugenge District<br />
                        Kigali, Rwanda
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-0">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-forest-500 to-sage-500 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest-800">Phone</h3>
                      <p className="text-forest-600">
                        +250 788 123 456<br />
                        +250 722 987 654
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-0">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-forest-500 to-sage-500 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest-800">Email</h3>
                      <p className="text-forest-600">
                        hello@plantshop.rw<br />
                        support@plantshop.rw
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass border-0">
                  <CardContent className="p-6 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-forest-500 to-sage-500 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-forest-800">Hours</h3>
                      <p className="text-forest-600">
                        Monday - Friday: 8:00 AM - 6:00 PM<br />
                        Saturday: 9:00 AM - 5:00 PM<br />
                        Sunday: 10:00 AM - 4:00 PM
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-forest-800 mb-6">
                  Find Us in Kigali
                </h2>
                <p className="text-forest-600 text-lg mb-8">
                  Located in the heart of Kigali, our store is easily accessible by public transport 
                  and offers ample parking for visitors.
                </p>
              </div>

              {/* Interactive Map */}
              <div className="aspect-video rounded-2xl overflow-hidden glass">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15949.071435658915!2d30.053773!3d-1.9440727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca4260932e889%3A0x47b824e5c2b7a7b6!2sKigali%2C%20Rwanda!5e0!3m2!1sen!2sus!4v1640000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PlantShop Location in Kigali, Rwanda"
                />
              </div>

              {/* Directions */}
              <Card className="glass border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-forest-800 mb-4">
                    Getting Here
                  </h3>
                  <div className="space-y-3 text-forest-600">
                    <p>
                      <strong>By Bus:</strong> Take any bus heading to Nyarugenge and get off at KG 15 Ave stop.
                    </p>
                    <p>
                      <strong>By Taxi:</strong> All taxi drivers know the KG 15 Ave area in Nyarugenge District.
                    </p>
                    <p>
                      <strong>By Car:</strong> Free parking available in front of our store.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-forest-50 to-sage-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold text-forest-800 mb-6">
              Ready to Start Your Plant Journey?
            </h2>
            <p className="text-xl text-forest-600 mb-8">
              Visit us today or browse our collection online. Our team is excited to help you 
              create the perfect green space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/products" 
                className="px-8 py-3 bg-gradient-to-r from-forest-500 to-sage-500 text-white rounded-full hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Shop Plants
              </a>
              <a 
                href="tel:+250788123456" 
                className="px-8 py-3 border-2 border-forest-500 text-forest-500 rounded-full hover:bg-forest-500 hover:text-white transition-all duration-300 font-semibold"
              >
                Call Us Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;