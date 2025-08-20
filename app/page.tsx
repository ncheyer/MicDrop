import Link from "next/link";
import { ArrowRight, Mic, Users, Zap, BarChart, Sparkles, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-speakabout-softGray">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
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
            </div>
            <div className="flex gap-4 items-center">
              <Link 
                href="/login" 
                className="px-5 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-2.5 bg-speakabout-gradient text-white font-semibold rounded-full hover:shadow-lg transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-white to-speakabout-softGray">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full mb-6 font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Launch Your Speaker Hub in 10 Minutes</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 font-display">
              Turn Your Talk Into a
              <span className="block bg-speakabout-gradient bg-clip-text text-transparent">
                Resource Empire
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Create comprehensive landing pages that convert attendees into connections. 
              Share resources, build your brand, and capture leads—all in one place.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                href="/signup" 
                className="inline-flex items-center px-8 py-4 bg-speakabout-gradient text-white font-semibold rounded-full hover:shadow-xl transition-all transform hover:scale-105"
              >
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/demo" 
                className="inline-flex items-center px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 font-semibold rounded-full hover:bg-primary-50 transition-all"
              >
                See Example Page
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 font-display">
                Everything You Need to
                <span className="text-primary-600"> Amplify Your Impact</span>
              </h2>
              <p className="text-xl text-gray-600">
                Professional tools designed for speakers who mean business
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group hover:scale-105 transition-transform">
                <div className="bg-gradient-to-br from-primary-100 to-primary-50 p-8 rounded-2xl h-full">
                  <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <Zap className="h-7 w-7 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">AI-Powered Content</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Paste your keynote outline and let AI generate compelling descriptions for all your resources
                  </p>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-transform">
                <div className="bg-gradient-to-br from-amber-100 to-orange-50 p-8 rounded-2xl h-full">
                  <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <Users className="h-7 w-7 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Smart Lead Capture</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Progressive disclosure model: free tools, gated resources, and newsletter signups
                  </p>
                </div>
              </div>
              
              <div className="group hover:scale-105 transition-transform">
                <div className="bg-gradient-to-br from-green-100 to-emerald-50 p-8 rounded-2xl h-full">
                  <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                    <BarChart className="h-7 w-7 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Track Engagement</h3>
                  <p className="text-gray-600 leading-relaxed">
                    See which resources resonate most and optimize your follow-up strategy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-speakabout-softGray">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16 font-display">
              Built for Professional Speakers
            </h2>
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-speakabout-gradient p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">The Complete Speaker Toolkit</h3>
                <p className="text-primary-100">Everything you need to maximize your talk's impact</p>
              </div>
              <div className="p-8 space-y-6">
                {[
                  {
                    title: "Resource Hub",
                    description: "Share GPTs, PDFs, frameworks, and slides all in one place"
                  },
                  {
                    title: "Business Development",
                    description: "Showcase your services and drive inquiries with integrated CTAs"
                  },
                  {
                    title: "Email Automation",
                    description: "Auto-generated follow-up sequences to nurture leads"
                  },
                  {
                    title: "QR Code Generation",
                    description: "Instant sharing during your presentation"
                  },
                  {
                    title: "Analytics Dashboard",
                    description: "Track views, downloads, and engagement metrics"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start group">
                    <div className="bg-green-100 rounded-full p-1.5 mr-4 group-hover:bg-green-200 transition-colors">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">10min</div>
                <div className="text-gray-600">Setup Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">3x</div>
                <div className="text-gray-600">More Leads</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">87%</div>
                <div className="text-gray-600">Email Open Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary-600 mb-2">$0</div>
                <div className="text-gray-600">To Get Started</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-speakabout-gradient">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-4xl font-bold text-white mb-6 font-display">
              Ready to Drop the Mic?
            </h2>
            <p className="text-xl text-primary-100 mb-10">
              Create your first speaker landing page in under 10 minutes
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center px-10 py-4 bg-white text-primary-600 font-bold rounded-full hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="mt-6 text-primary-100 text-sm">
              No credit card required • Free forever plan available
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-speakabout-gradient p-1.5 rounded-lg">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <div className="ml-2">
                  <span className="font-semibold text-white">MicDrop</span>
                  <span className="block text-xs text-primary-100">by Speak About AI</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                The professional speaker's platform for turning talks into business.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <div className="space-y-2">
                <Link href="/features" className="block text-sm hover:text-white transition-colors">Features</Link>
                <Link href="/pricing" className="block text-sm hover:text-white transition-colors">Pricing</Link>
                <Link href="/examples" className="block text-sm hover:text-white transition-colors">Examples</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-sm hover:text-white transition-colors">About</Link>
                <Link href="/blog" className="block text-sm hover:text-white transition-colors">Blog</Link>
                <Link href="/contact" className="block text-sm hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-sm hover:text-white transition-colors">Privacy</Link>
                <Link href="/terms" className="block text-sm hover:text-white transition-colors">Terms</Link>
                <Link href="/cookies" className="block text-sm hover:text-white transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm">
            © 2025 MicDrop by Speak About AI. Built for speakers who mean business.
          </div>
        </div>
      </footer>
    </div>
  );
}