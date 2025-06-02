
import { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LegalPage = () => {
  const [activeTab, setActiveTab] = useState("terms");
  
  return (
    <Layout>
      <div className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Legal Information</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Important policies and terms regarding the use of our services
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
            <Tabs defaultValue="terms" onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger 
                  value="terms"
                  className={`text-base ${activeTab === "terms" ? "bg-primary-500 text-white" : ""}`}
                >
                  Terms of Service
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  className={`text-base ${activeTab === "privacy" ? "bg-primary-500 text-white" : ""}`}
                >
                  Privacy Policy
                </TabsTrigger>
                <TabsTrigger 
                  value="cookies" 
                  className={`text-base ${activeTab === "cookies" ? "bg-primary-500 text-white" : ""}`}
                >
                  Cookie Policy
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="terms" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Terms of Service</h2>
                  <p className="text-gray-700 mb-4">Last updated: May 9, 2025</p>
                  
                  <div className="prose max-w-none text-gray-700">
                    <h3 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h3>
                    <p>
                      By accessing or using the Carvix platform ("Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">2. Description of Service</h3>
                    <p>
                      Carvix provides an online platform for users to customize, visualize, and potentially purchase vehicles through affiliated dealerships. Our Service includes 3D visualization tools, augmented reality features, and other related services.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h3>
                    <p>
                      When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password and for all activities that occur under your account.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">4. Content and Intellectual Property</h3>
                    <p>
                      All content, features, and functionality on our Service, including but not limited to 3D models, designs, text, graphics, and software, are owned by Carvix and its licensors and are protected by intellectual property laws.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">5. User Conduct</h3>
                    <p>
                      You agree not to misuse our Service or help anyone else do so. For example, you must not attempt to:
                    </p>
                    <ul className="list-disc pl-6 my-3">
                      <li>Probe, scan, or test the vulnerability of any system or network;</li>
                      <li>Breach or otherwise circumvent any security or authentication measures;</li>
                      <li>Access, tamper with, or use non-public areas of the Service;</li>
                      <li>Interfere with or disrupt any user, host, or network;</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">6. Limitation of Liability</h3>
                    <p>
                      To the maximum extent permitted by law, Carvix shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the Service.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">7. Changes to Terms</h3>
                    <p>
                      We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">8. Contact Us</h3>
                    <p>
                      If you have any questions about these Terms, please contact us at legal@carvix.com.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Privacy Policy</h2>
                  <p className="text-gray-700 mb-4">Last updated: May 9, 2025</p>
                  
                  <div className="prose max-w-none text-gray-700">
                    <h3 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h3>
                    <p>
                      We collect several types of information from and about users of our Service, including:
                    </p>
                    <ul className="list-disc pl-6 my-3">
                      <li>Personal information (name, email address, phone number)</li>
                      <li>Usage information (how you interact with our Service)</li>
                      <li>Device information (browser type, IP address)</li>
                      <li>Location information (when you use our AR features)</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h3>
                    <p>
                      We use information that we collect about you or that you provide to us:
                    </p>
                    <ul className="list-disc pl-6 my-3">
                      <li>To present our Service and its contents to you</li>
                      <li>To provide you with information, products, or services</li>
                      <li>To fulfill any other purpose for which you provide it</li>
                      <li>To notify you about changes to our Service</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">3. Data Security</h3>
                    <p>
                      We implement measures designed to provide a level of security appropriate to the risk of processing your personal information. However, no method of transmission over the Internet is 100% secure.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">4. Data Sharing</h3>
                    <p>
                      We may disclose your personal information to our subsidiaries and affiliates, to dealerships when you express interest in a vehicle, and to contractors, service providers, and other third parties we use to support our business.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">5. Your Rights</h3>
                    <p>
                      Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your personal information.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">6. Children's Privacy</h3>
                    <p>
                      Our Service is not directed to children under 16, and we do not knowingly collect personal information from children under 16.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">7. Changes to Our Privacy Policy</h3>
                    <p>
                      We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cookies" className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Cookie Policy</h2>
                  <p className="text-gray-700 mb-4">Last updated: May 9, 2025</p>
                  
                  <div className="prose max-w-none text-gray-700">
                    <h3 className="text-xl font-semibold mt-6 mb-3">1. What Are Cookies</h3>
                    <p>
                      Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">2. How Carvix Uses Cookies</h3>
                    <p>
                      When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 my-3">
                      <li>To enable certain functions of the Service</li>
                      <li>To provide analytics</li>
                      <li>To store your preferences</li>
                      <li>To enable advertisements delivery</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">3. Types of Cookies We Use</h3>
                    <p>
                      We use both session and persistent cookies on the Service and we use different types of cookies to run the Service:
                    </p>
                    <ul className="list-disc pl-6 my-3">
                      <li>Essential cookies: These cookies are required for the operation of our website.</li>
                      <li>Analytical/performance cookies: These allow us to recognize and count the number of visitors and see how visitors move around our website.</li>
                      <li>Functionality cookies: These are used to recognize you when you return to our website.</li>
                      <li>Targeting cookies: These cookies record your visit to our website, the pages you have visited, and the links you have followed.</li>
                    </ul>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">4. Managing Cookies</h3>
                    <p>
                      Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version. You can, however, obtain up-to-date information about blocking and deleting cookies via your browser's help section.
                    </p>
                    
                    <h3 className="text-xl font-semibold mt-6 mb-3">5. Changes to Our Cookie Policy</h3>
                    <p>
                      We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LegalPage;
