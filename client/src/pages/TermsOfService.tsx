import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-forest-800 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: December 2024</p>

          <div className="prose prose-lg max-w-none text-forest-600 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using PlantShop Rwanda's website and services, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations of Rwanda. If you do not agree with any of these terms, 
                you are prohibited from using our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">2. Description of Service</h2>
              <p>
                PlantShop Rwanda operates an online plant retail business, providing plants, gardening supplies, 
                and related services to customers in Rwanda. We offer delivery services within Kigali and selected areas in Rwanda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">3. Account Registration</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>You must be at least 18 years old to create an account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">4. Orders and Payment</h2>
              <h3 className="text-lg font-semibold text-forest-700 mb-2">Order Processing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All orders are subject to acceptance and availability</li>
                <li>We reserve the right to refuse or cancel any order</li>
                <li>Prices are subject to change without notice</li>
                <li>Orders are processed during business hours (Monday-Friday, 8 AM-6 PM)</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-forest-700 mb-2 mt-4">Payment Terms</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment is required at the time of order</li>
                <li>We accept major credit cards and mobile money (MTN Mobile Money, Airtel Money)</li>
                <li>All prices are in Rwandan Francs (RWF) unless otherwise stated</li>
                <li>Applicable taxes will be added to your order total</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">5. Delivery and Shipping</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Delivery times are estimates and not guaranteed</li>
                <li>Risk of loss passes to you upon delivery</li>
                <li>Delivery fees apply based on location within Rwanda</li>
                <li>Live plants require special handling and may have extended delivery times</li>
                <li>We are not responsible for delays due to weather or circumstances beyond our control</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">6. Returns and Refunds</h2>
              <h3 className="text-lg font-semibold text-forest-700 mb-2">Live Plants</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Plants must be reported as damaged or dead within 48 hours of delivery</li>
                <li>Photos may be required for assessment</li>
                <li>Replacement or refund will be provided for confirmed issues</li>
                <li>Plants damaged due to customer negligence are not eligible for return</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-forest-700 mb-2 mt-4">Other Products</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Non-plant items may be returned within 14 days of delivery</li>
                <li>Items must be in original condition and packaging</li>
                <li>Customer is responsible for return shipping costs unless item was defective</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">7. Plant Care and Warranties</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We provide care instructions with each plant purchase</li>
                <li>Plants are living organisms and success depends on proper care</li>
                <li>We do not guarantee plant survival beyond the initial 48-hour period</li>
                <li>Care support is available through our customer service team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">8. Prohibited Uses</h2>
              <p>You may not use our service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>For any unlawful purpose or to solicit unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations or laws</li>
                <li>To transmit or procure the sending of any advertising or promotional material</li>
                <li>To impersonate or attempt to impersonate the company or its employees</li>
                <li>To interfere with or circumvent the security features of the service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">9. Intellectual Property</h2>
              <p>
                The service and its original content, features, and functionality are owned by PlantShop Rwanda and are protected by 
                international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">10. Limitation of Liability</h2>
              <p>
                In no event shall PlantShop Rwanda, nor its directors, employees, partners, agents, suppliers, or affiliates, 
                be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, 
                loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">11. Governing Law</h2>
              <p>
                These Terms shall be interpreted and governed by the laws of the Republic of Rwanda. 
                Any disputes arising from these terms will be resolved in the courts of Rwanda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">13. Contact Information</h2>
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <div className="bg-forest-50 p-4 rounded-lg mt-4">
                <p><strong>PlantShop Rwanda</strong></p>
                <p>Email: legal@plantshop.rw</p>
                <p>Phone: +250 788 123 456</p>
                <p>Address: KG 15 Ave, Nyarugenge District, Kigali, Rwanda</p>
                <p>Business Registration: [Registration Number]</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;