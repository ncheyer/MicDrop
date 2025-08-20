"use client";

import { useState } from "react";
import { ExternalLink, Download, Lock, Sparkles, Bot, FileText, Brain, Zap, Layers, Lightbulb, Mail, Gift, Send } from "lucide-react";

interface CustomGPT {
  name: string;
  description: string;
  url: string;
}

interface DownloadResource {
  title: string;
  description?: string;
  fileUrl: string;
  requiresEmail: boolean;
}

interface ResourcesAndNewsletterSectionProps {
  customGpts: CustomGPT[];
  downloads: DownloadResource[];
  newsletterEnabled?: boolean;
  newsletterDescription?: string;
  newsletterBannerUrl?: string;
  onGPTClick: (name: string) => void;
  onDownload: (title: string, requiresEmail: boolean) => void;
  onNewsletterSignup: (email: string) => void;
  totalGpts?: number;
  totalDownloads?: number;
  isLocked?: boolean;
}

export default function ResourcesAndNewsletterSection({
  customGpts,
  downloads,
  newsletterEnabled = true,
  newsletterDescription,
  newsletterBannerUrl,
  onGPTClick,
  onDownload,
  onNewsletterSignup,
  totalGpts = 0,
  totalDownloads = 0,
  isLocked = false,
}: ResourcesAndNewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedDownload, setSelectedDownload] = useState<DownloadResource | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNewsletterSignup(email);
    setSubscribed(true);
  };

  const handleDownload = (download: DownloadResource) => {
    if (download.requiresEmail && !email) {
      setSelectedDownload(download);
      setShowEmailModal(true);
    } else {
      onDownload(download.title, download.requiresEmail);
      window.open(download.fileUrl, "_blank");
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDownload) {
      onDownload(selectedDownload.title, true);
      window.open(selectedDownload.fileUrl, "_blank");
      setShowEmailModal(false);
    }
  };

  return (
    <section id="resources" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          <Sparkles className="inline-block h-8 w-8 text-yellow-500 mr-2" />
          FREE TOOLS & RESOURCES FROM THIS TALK
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Subscribe to get instant access to all AI tools and receive future updates
        </p>

        {/* Newsletter Signup with Banner */}
        {newsletterEnabled && (
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto">
              {/* Banner Image */}
              {newsletterBannerUrl && (
                <div className="h-48 md:h-64 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
                  <img
                    src={newsletterBannerUrl}
                    alt="Newsletter banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}
              
              <div className="p-8 md:p-10">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="mb-4">
                    <img 
                      src="/do-more-with-less-logo.png" 
                      alt="Do More With Less Using AI" 
                      className="h-16 w-auto mx-auto"
                    />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3">
                    {customGpts.length > 0 ? (
                      <>
                        Subscribe & Unlock All {customGpts.length} AI Tools
                        <Bot className="inline-block h-5 w-5 ml-2 text-primary-600" />
                      </>
                    ) : (
                      "Get Exclusive Resources & Updates"
                    )}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {newsletterDescription || 
                      "Join our newsletter for immediate access to all tools and future insights from this talk."}
                  </p>

                  {!subscribed ? (
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="submit"
                        className="group px-6 py-3 bg-primary-600 text-white font-bold rounded-lg hover:bg-primary-700 transition-all hover:scale-105 shadow-md flex items-center justify-center gap-2"
                      >
                        <span>Get Access</span>
                        <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>
                  ) : (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="bg-green-500 rounded-full p-1">
                          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="font-bold text-lg text-green-800">You're all set!</p>
                      </div>
                      <p className="text-green-700">
                        Check your inbox for access to all tools and resources
                      </p>
                    </div>
                  )}

                  {/* Benefits */}
                  {!subscribed && (
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        Instant Access
                      </span>
                      <span className="flex items-center gap-1">
                        <Bot className="h-4 w-4 text-primary-600" />
                        {customGpts.length} AI Tools
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-gray-600" />
                        {downloads.length} Resources
                      </span>
                      <span className="flex items-center gap-1">
                        <Gift className="h-4 w-4 text-green-600" />
                        Future Updates
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GPT Tools Grid */}
        {(customGpts.length > 0 || totalGpts > 0) && (
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary-600" />
              AI Implementation Tools
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customGpts.map((gpt, index) => {
                const icons = [Bot, Brain, Zap, Lightbulb, Layers];
                const Icon = icons[index % icons.length];
                const colors = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-amber-500", "bg-rose-500"];
                const bgColor = colors[index % colors.length];
                
                return (
                  <div
                    key={gpt.name}
                    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-primary-200 hover:-translate-y-1"
                    onClick={() => {
                      onGPTClick(gpt.name);
                    }}
                  >
                    <div className={`${bgColor} bg-opacity-10 rounded-lg p-3 inline-block mb-4`}>
                      <Icon className={`h-6 w-6 ${bgColor.replace('bg-', 'text-')}`} />
                    </div>
                    <h4 className="font-semibold mb-2 flex items-center justify-between group-hover:text-primary-600 transition-colors">
                      {gpt.name}
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{gpt.description}</p>
                    <div className="mt-4 text-xs text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to explore →
                    </div>
                  </div>
                );
              })}
              
              {isLocked && totalGpts > customGpts.length && (
                <div
                  className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-primary-400 transition-colors flex flex-col items-center justify-center"
                  onClick={() => onGPTClick("locked")}
                >
                  <Lock className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    +{totalGpts - customGpts.length} more GPTs
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Subscribe to unlock</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Downloadable Resources */}
        {(downloads.length > 0 || totalDownloads > 0) && (
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary-600" />
              Downloadable Frameworks & Guides
            </h3>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {downloads.map((download, index) => (
                <div
                  key={download.title}
                  className={`group p-6 flex items-center justify-between hover:bg-gradient-to-r hover:from-primary-50 hover:to-transparent cursor-pointer transition-all ${
                    index !== downloads.length - 1 ? "border-b border-gray-100" : ""
                  }`}
                  onClick={() => handleDownload(download)}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="bg-primary-100 rounded-lg p-2.5 group-hover:bg-primary-200 transition-colors">
                      <FileText className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1 flex items-center gap-2 group-hover:text-primary-700 transition-colors">
                        {download.title}
                        {download.requiresEmail && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Email Required</span>
                        )}
                      </h4>
                      {download.description && (
                        <p className="text-sm text-gray-600">{download.description}</p>
                      )}
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-primary-600 group-hover:animate-bounce" />
                </div>
              ))}
              
              {isLocked && totalDownloads > downloads.length && (
                <div
                  className="p-6 flex items-center justify-between bg-gray-50 hover:bg-gray-100 cursor-pointer border-t"
                  onClick={() => onDownload("locked", true)}
                >
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-semibold text-gray-600">
                        +{totalDownloads - downloads.length} more resources available
                      </h4>
                      <p className="text-sm text-gray-500">Subscribe to unlock all downloads</p>
                    </div>
                  </div>
                  <Download className="h-5 w-5 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Email Modal for Downloads */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Get Your Resources</h3>
            <p className="text-gray-600 mb-6">
              Enter your email to access this resource
            </p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border rounded-lg mb-4"
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Get Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}