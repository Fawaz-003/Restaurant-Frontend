import React, { useState, useEffect } from 'react';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('information-collection');

  // Smooth scroll function
  const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80; // header height
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    setActiveSection(sectionId);
  }
};


  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.policy-section');
      const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
  const el = section ;
  const sectionTop = el.offsetTop;
  const sectionHeight = el.clientHeight;
  const sectionId = el.getAttribute("id");

  if (
    sectionId &&
    scrollPosition >= sectionTop &&
    scrollPosition < sectionTop + sectionHeight
  ) {
    setActiveSection(sectionId);
  }
});

    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      content: `We collect information to provide better services to all our users. The types of information we collect include:

• Personal Information: When you create an account, we collect your name, email address, phone number, and delivery address.
• Payment Information: We collect payment card details or other payment account information when you place an order.
• Location Information: With your consent, we collect and process information about your actual location.
• Usage Information: We collect information about how you interact with our services, including access times, pages viewed, and other system activity.
• Device Information: We collect device-specific information such as hardware model, operating system, and mobile network information.`
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      content: `We use the information we collect for the following purposes:

• To provide, maintain, and improve our services
• To process your food orders and deliver meals
• To send you technical notices and support messages
• To communicate with you about products, services, and promotional offers
• To monitor and analyze trends and usage
• To detect, prevent, and address technical issues and fraud
• To personalize your experience and show you relevant content`
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      content: `We do not share your personal information with companies, organizations, or individuals outside of FoodApp except in the following cases:

• With Restaurant Partners: We share your order details with restaurants to fulfill your orders.
• With Delivery Partners: We share necessary delivery information with our delivery personnel.
• For Legal Reasons: We will share personal information if we believe it's reasonably necessary to comply with law or legal process.
• With Your Consent: We will share personal information with third parties when we have your consent to do so.
• Business Transfers: In connection with a merger, acquisition, or sale of assets.`
    },
    {
      id: 'data-security',
      title: 'Data Security',
      content: `We implement appropriate technical and organizational security measures designed to protect your personal information. These include:

• Encryption of data in transit using SSL/TLS protocols
• Secure storage of personal information with access controls
• Regular security assessments and testing
• Employee training on data protection
• Secure payment processing through PCI-compliant partners

However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.`
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      content: `You have the following rights regarding your personal information:

• Access: You can request access to the personal information we hold about you.
• Correction: You can request correction of any inaccurate or incomplete information.
• Deletion: You can request deletion of your personal information in certain circumstances.
• Objection: You can object to processing of your personal information.
• Portability: You can request transfer of your data to another service.
• Withdraw Consent: You can withdraw your consent at any time where we rely on consent to process your information.

To exercise these rights, please contact us at privacy@foodapp.com.`
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking',
      content: `We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.

Types of cookies we use:

• Essential Cookies: Required for the basic functions of the app
• Preference Cookies: Remember your settings and preferences
• Analytics Cookies: Help us understand how users interact with our service
• Marketing Cookies: Used to deliver relevant advertisements

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`
    },
    {
      id: 'children-privacy',
      title: "Children's Privacy",
      content: `Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from children under 13.

If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from children without verification of parental consent, we take steps to remove that information from our servers.`
    },
    {
      id: 'changes',
      title: 'Changes to This Policy',
      content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.

We will let you know via email and/or a prominent notice on our service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.`
    }
  ];

  const quickLinks = [
    { id: 'information-collection', title: 'Information Collection' },
    { id: 'information-use', title: 'Information Use' },
    { id: 'information-sharing', title: 'Information Sharing' },
    { id: 'data-security', title: 'Data Security' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'children-privacy', title: "Children's Privacy" },
    { id: 'changes', title: 'Policy Changes' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-orange-500">
              FoodApp
            </div>
   
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
 
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Quick Links</h3>
              <nav className="space-y-2">
                {quickLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition duration-300 ${
                      activeSection === link.id
                        ? 'bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500'
                        : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    {link.title}
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Contact our privacy team for any questions about this policy.
                </p>
                <a 
                  href="mailto:privacy@foodapp.com" 
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                >
                  privacy@foodapp.com
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm">
              
              {/* Introduction */}
              <div 
                id="introduction"
                className="policy-section p-8 border-b border-gray-100 scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to FoodApp. We are committed to protecting your privacy and ensuring transparency about how we handle your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
                </p>
                <p className="text-gray-600 leading-relaxed mt-4">
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the application.
                </p>
              </div>

              {/* Policy Sections */}
              {sections.map((section) => (
                <div 
                  key={section.id}
                  id={section.id}
                  className="policy-section p-8 border-b border-gray-100 scroll-mt-24"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">{section.title}</h2>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}

              {/* Contact Information */}
              <div 
                id="contact"
                className="policy-section p-8 scroll-mt-24"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Email:</strong> privacy@foodapp.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 Food Street, Restaurant City, RC 12345</p>
                </div>
              </div>
            </div>

            {/* Back to Top Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 flex items-center space-x-2"
              >
                <span>Back to Top</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>

            {/* Consent Banner */}
            <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
            
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Your Consent</h3>
                  <p className="text-gray-600 text-sm">
                    By using our service, you consent to our Privacy Policy and agree to its terms. We recommend reviewing this policy regularly to stay informed about how we are protecting your information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Privacy;