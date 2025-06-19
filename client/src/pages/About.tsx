import { motion } from 'framer-motion';
import { Leaf, Heart, Code, Users, Award, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
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
              Our Story
            </h1>
            <p className="text-xl text-forest-600 leading-relaxed">
              Born from a passion for plants and technology, PlantShop brings nature closer to your home
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vanessa's Story */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-forest-800">
                Meet Vanessa
              </h2>
              <div className="prose prose-lg text-forest-600">
                <p>
                  It all started with a young lady named Vanessa, who discovered her love for plants during her computer science studies. 
                  While debugging code late into the night, she found solace in the small succulent on her desk—a gift from her grandmother.
                </p>
                <p>
                  As her plant collection grew, so did her programming skills. Vanessa realized that many people struggled to find the right plants 
                  for their homes and lacked proper care guidance. She envisioned a digital platform that could bridge this gap, combining her 
                  technical expertise with her botanical passion.
                </p>
                <p>
                  After graduating, Vanessa spent months researching plant care, interviewing botanists, and designing user-friendly interfaces. 
                  She wanted to create more than just an online store—she aimed to build a community where plant lovers could thrive together.
                </p>
                <p>
                  Today, PlantShop reflects Vanessa's vision: a place where technology meets nature, where every plant finds the right home, 
                  and where both beginners and experts can discover the joy of plant parenthood.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl glass p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-forest-500 to-sage-500 rounded-full mx-auto flex items-center justify-center">
                    <Heart className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-forest-800">Vanessa Rodriguez</h3>
                  <p className="text-forest-600">Founder & Plant Enthusiast</p>
                  <div className="flex justify-center space-x-4 pt-4">
                    <div className="flex items-center space-x-2">
                      <Code className="w-5 h-5 text-forest-500" />
                      <span className="text-sm text-forest-600">Developer</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Leaf className="w-5 h-5 text-sage-500" />
                      <span className="text-sm text-forest-600">Botanist</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-gradient-to-br from-sage-50 to-forest-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-forest-800 mb-6">
              Our Mission & Values
            </h2>
            <p className="text-xl text-forest-600 max-w-3xl mx-auto">
              We believe everyone deserves to experience the joy and benefits of plant ownership, 
              regardless of their experience level or living situation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: "Sustainability",
                description: "We source our plants responsibly and promote eco-friendly practices in everything we do."
              },
              {
                icon: Heart,
                title: "Community",
                description: "Building a supportive community where plant lovers can share knowledge and grow together."
              },
              {
                icon: Award,
                title: "Quality",
                description: "Every plant is carefully selected and nurtured to ensure it arrives healthy and ready to thrive."
              },
              {
                icon: Users,
                title: "Education",
                description: "Empowering our customers with the knowledge and tools they need for successful plant care."
              },
              {
                icon: Globe,
                title: "Accessibility",
                description: "Making plant ownership accessible to everyone, from tiny apartments to large gardens."
              },
              {
                icon: Code,
                title: "Innovation",
                description: "Using technology to enhance the plant shopping experience and care guidance."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
              >
                <Card className="glass border-0 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-forest-500 to-sage-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-forest-800 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-forest-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-forest-800 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-forest-600">
              From a single succulent to a thriving community
            </p>
          </motion.div>

          <div className="space-y-12">
            {[
              {
                year: "2020",
                title: "The First Succulent",
                description: "Vanessa receives her first plant, sparking a lifelong passion for botany and plant care."
              },
              {
                year: "2021",
                title: "Growing Collection",
                description: "While studying computer science, Vanessa's apartment transforms into a mini greenhouse with dozens of plants."
              },
              {
                year: "2022",
                title: "The Idea",
                description: "Recognizing the challenges new plant parents face, Vanessa begins developing the concept for PlantShop."
              },
              {
                year: "2023",
                title: "Building the Platform",
                description: "Months of coding, testing, and partnering with local nurseries to create the perfect plant shopping experience."
              },
              {
                year: "2024",
                title: "PlantShop Launch",
                description: "PlantShop officially launches, serving plant enthusiasts with carefully curated plants and expert guidance."
              },
              {
                year: "2025",
                title: "Growing Community",
                description: "Today, PlantShop serves thousands of happy plant parents, continuing to grow and evolve with our community's needs."
              }
            ].map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
                className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="glass p-6 rounded-2xl">
                    <div className="text-2xl font-bold text-forest-500 mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-forest-800 mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-forest-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-4 h-4 bg-gradient-to-br from-forest-500 to-sage-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Future */}
      <section className="py-20 bg-gradient-to-br from-forest-50 to-sage-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <h2 className="text-4xl font-bold text-forest-800 mb-6">
              Join Our Growing Family
            </h2>
            <p className="text-xl text-forest-600 mb-8">
              Whether you're a seasoned plant parent or just starting your green journey, 
              we're here to help you create the indoor oasis of your dreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/products" 
                className="px-8 py-3 bg-gradient-to-r from-forest-500 to-sage-500 text-white rounded-full hover:shadow-lg transition-all duration-300 font-semibold"
              >
                Shop Plants
              </a>
              <a 
                href="mailto:hello@plantshop.com" 
                className="px-8 py-3 border-2 border-forest-500 text-forest-500 rounded-full hover:bg-forest-500 hover:text-white transition-all duration-300 font-semibold"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;