import Link from "next/link";
import { Shield, Eye, Download, Trash2, Mail, Phone } from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 20, 2025";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <img 
                src="/favicon.png" 
                alt="Speak About AI" 
                className="h-10 w-10"
              />
              <div className="ml-3">
                <span className="text-xl font-bold bg-speakabout-gradient bg-clip-text text-transparent">
                  MicDrop
                </span>
                <span className="block text-xs text-gray-600 -mt-1">
                  by Speak About AI
                </span>
              </div>
            </Link>
            <Link 
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-primary-100 rounded-full p-3 mb-4">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Your privacy matters to us. Learn how we collect, use, and protect your data.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Quick Access */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">Quick Access</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Your Rights</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Access your data</li>
                  <li>• Request data deletion</li>
                  <li>• Opt-out of tracking</li>
                  <li>• Data portability</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-800 mb-2">Contact Us</h3>
                <p className="text-sm text-blue-700">
                  For privacy inquiries: <br />
                  <a href="mailto:privacy@speakabout.ai" className="underline">privacy@speakabout.ai</a>
                </p>
              </div>
            </div>
          </div>

          {/* Section 1: Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Information You Provide</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>Account Information:</strong> Name, email address, password when you create an account</li>
                  <li><strong>Profile Information:</strong> Speaker bio, photo, social media links, business information</li>
                  <li><strong>Content:</strong> Talk descriptions, resources, GPT tools you upload</li>
                  <li><strong>Communications:</strong> Messages you send us via contact forms or email</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Information We Collect Automatically</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>Usage Data:</strong> Pages visited, features used, time spent on site</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                  <li><strong>Analytics:</strong> Click tracking, page views, conversion rates (with consent)</li>
                  <li><strong>Cookies:</strong> Session data, preferences, authentication tokens</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Information from Third Parties</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>Social Media:</strong> Public profile information when you connect accounts</li>
                  <li><strong>Payment Processors:</strong> Transaction data for billing purposes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Service Provision</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Create and manage your speaker pages</li>
                  <li>• Process newsletter signups</li>
                  <li>• Enable resource downloads</li>
                  <li>• Provide customer support</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Analytics & Improvement</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Analyze usage patterns</li>
                  <li>• Improve platform features</li>
                  <li>• Generate performance reports</li>
                  <li>• Prevent fraud and abuse</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Communications</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Send account notifications</li>
                  <li>• Provide feature updates</li>
                  <li>• Respond to support requests</li>
                  <li>• Send marketing emails (with consent)</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Legal Compliance</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Comply with legal obligations</li>
                  <li>• Protect our rights and property</li>
                  <li>• Ensure platform security</li>
                  <li>• Respond to legal requests</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Legal Basis (GDPR) */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Legal Basis for Processing (GDPR)</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2 mt-1">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Contract Performance</h3>
                  <p className="text-gray-600 text-sm">Processing necessary to provide our services as outlined in our Terms of Service.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 rounded-full p-2 mt-1">
                  <Eye className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Legitimate Interest</h3>
                  <p className="text-gray-600 text-sm">Analytics and platform improvement, fraud prevention, and security measures.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 rounded-full p-2 mt-1">
                  <Mail className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Consent</h3>
                  <p className="text-gray-600 text-sm">Marketing communications, non-essential cookies, and advanced analytics features.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 rounded-full p-2 mt-1">
                  <Phone className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Legal Obligation</h3>
                  <p className="text-gray-600 text-sm">Compliance with applicable laws, tax requirements, and legal requests.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Privacy Rights</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary-600" />
                    Access & Portability
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Request a copy of your personal data in a portable format.
                  </p>
                  <a 
                    href="/api/user/data-export" 
                    className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 underline"
                  >
                    <Download className="h-3 w-3" />
                    Download My Data
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    Deletion & Erasure
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Request deletion of your personal data and account.
                  </p>
                  <a 
                    href="mailto:privacy@micdrop.com?subject=Data%20Deletion%20Request" 
                    className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 underline"
                  >
                    <Mail className="h-3 w-3" />
                    Request Deletion
                  </a>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Rectification</h3>
                  <p className="text-sm text-gray-600">
                    Update or correct inaccurate personal information in your account settings.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Restriction</h3>
                  <p className="text-sm text-gray-600">
                    Limit how we process your data while we investigate a complaint.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Objection</h3>
                  <p className="text-sm text-gray-600">
                    Object to processing based on legitimate interests or for marketing purposes.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Withdraw Consent</h3>
                  <p className="text-sm text-gray-600">
                    Withdraw consent for marketing communications and optional data processing.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Sharing & Disclosure</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-800">Service Providers</h3>
                <p className="text-gray-600 text-sm">
                  We share data with trusted third parties who help us operate our platform (hosting, analytics, payment processing).
                  All providers are contractually bound to protect your data.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-800">Business Transfers</h3>
                <p className="text-gray-600 text-sm">
                  In the event of a merger, acquisition, or sale, your data may be transferred as part of the business assets.
                  You will be notified of any such transfer.
                </p>
              </div>

              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-800">Legal Requirements</h3>
                <p className="text-gray-600 text-sm">
                  We may disclose data when required by law, court order, or to protect our rights and the safety of our users.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="bg-green-100 rounded-full p-3 mx-auto mb-3 w-fit">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Encryption</h3>
                <p className="text-sm text-gray-600">All data transmitted and stored is encrypted using industry-standard protocols.</p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="bg-blue-100 rounded-full p-3 mx-auto mb-3 w-fit">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Access Controls</h3>
                <p className="text-sm text-gray-600">Strict access controls ensure only authorized personnel can access your data.</p>
              </div>

              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="bg-purple-100 rounded-full p-3 mx-auto mb-3 w-fit">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Regular Audits</h3>
                <p className="text-sm text-gray-600">We conduct regular security audits and vulnerability assessments.</p>
              </div>
            </div>
          </section>

          {/* Section 7: Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-3">Retention Periods</h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li><strong>Account Data:</strong> Retained while your account is active and for 2 years after deletion</li>
                <li><strong>Analytics Data:</strong> Aggregated data retained for up to 5 years for business insights</li>
                <li><strong>Email Communications:</strong> Transactional emails retained for 7 years for legal compliance</li>
                <li><strong>Support Tickets:</strong> Retained for 3 years to improve customer service</li>
                <li><strong>Marketing Data:</strong> Deleted immediately upon unsubscribe or opt-out</li>
              </ul>
            </div>
          </section>

          {/* Section 8: International Transfers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
            
            <p className="text-gray-600 mb-4">
              Your data may be transferred to and processed in countries other than your country of residence. 
              We ensure adequate protection through:
            </p>

            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy decisions for transfers to countries with adequate protection</li>
              <li>Binding Corporate Rules for intra-group transfers</li>
              <li>Certification schemes and codes of conduct</li>
            </ul>
          </section>

          {/* Section 9: Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Information</h2>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <h3 className="font-semibold text-primary-800 mb-3">Data Protection Officer</h3>
              <div className="text-sm text-primary-700 space-y-1">
                <p><strong>Email:</strong> privacy@speakabout.ai</p>
                <p><strong>Address:</strong> Speak About AI Privacy Team, [Your Address]</p>
                <p><strong>Response Time:</strong> We respond to privacy requests within 30 days</p>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                <strong>EU Representative:</strong> For users in the European Union, you may also contact our EU representative 
                at eu-representative@speakabout.ai for privacy-related inquiries.
              </p>
            </div>
          </section>

          {/* Section 10: Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Policy Updates</h2>
            
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time. When we make material changes, we will:
            </p>

            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Notify you via email if you have an account with us</li>
              <li>Display a prominent notice on our website</li>
              <li>Update the "Last Modified" date at the top of this policy</li>
              <li>For significant changes, provide 30 days advance notice</li>
            </ul>

            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Your continued use of our services after any changes indicates your acceptance of the updated Privacy Policy.</strong>
              </p>
            </div>
          </section>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-12 p-8 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Questions about your privacy?</h3>
          <p className="text-gray-600 mb-4">
            We're here to help. Contact our privacy team for any questions or concerns.
          </p>
          <a 
            href="mailto:privacy@speakabout.ai"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Contact Privacy Team
          </a>
        </div>
      </div>
    </div>
  );
}