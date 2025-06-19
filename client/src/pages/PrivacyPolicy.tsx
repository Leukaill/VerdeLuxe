import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-forest-800 mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: December 2024</p>

          <div className="prose prose-lg max-w-none text-forest-600 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">1. Introduction</h2>
              <p>
                PlantShop Rwanda ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
                This privacy policy explains how we collect, use, and safeguard your information when you visit our website 
                or make purchases from our store, in compliance with Rwandan data protection laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold text-forest-700 mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information (email, phone number, address)</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Purchase history and preferences</li>
                <li>Account credentials and profile information</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-forest-700 mb-2 mt-4">Technical Information</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address and browser information</li>
                <li>Device information and operating system</li>
                <li>Website usage data and analytics</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send important updates about your orders and account</li>
                <li>Improve our website and services</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Comply with legal obligations under Rwandan law</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">4. Information Sharing</h2>
              <p>We do not sell your personal information. We may share your data only in these circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With delivery partners to fulfill your orders</li>
                <li>With payment processors to handle transactions</li>
                <li>With service providers who help us operate our business</li>
                <li>When required by Rwandan law or legal processes</li>
                <li>To protect our rights or prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">6. Your Rights</h2>
              <p>Under Rwandan data protection law, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your personal data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">7. Cookies</h2>
              <p>
                We use cookies to enhance your browsing experience, analyze website traffic, and personalize content. 
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">8. International Transfers</h2>
              <p>
                Your data may be transferred to and processed in countries outside Rwanda for the purposes described in this policy. 
                We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">9. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
                privacy policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-forest-800 mb-4">10. Contact Us</h2>
              <p>If you have any questions about this privacy policy or our data practices, please contact us:</p>
              <div className="bg-forest-50 p-4 rounded-lg mt-4">
                <p><strong>PlantShop Rwanda</strong></p>
                <p>Email: privacy@plantshop.rw</p>
                <p>Phone: +250 788 123 456</p>
                <p>Address: KG 15 Ave, Nyarugenge District, Kigali, Rwanda</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;