"use client";

import { useState } from "react";
import { Send, Mail, Sparkles, Bot, Gift } from "lucide-react";

interface NewsletterSectionProps {
  newsletterEnabled?: boolean;
  newsletterDescription?: string;
  hasGPTs: boolean;
  onNewsletterSignup: (email: string) => void;
}

export default function NewsletterSection({
  newsletterEnabled = true,
  newsletterDescription,
  hasGPTs,
  onNewsletterSignup,
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNewsletterSignup(email);
    setSubscribed(true);
  };

  if (!newsletterEnabled) return null;

  return (
    <section id="newsletter" className="py-12 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-10">
          <div className="text-center max-w-2xl mx-auto">
            {/* Icon */}
            <div className="inline-flex items-center justify-center bg-white/20 rounded-full p-4 mb-6">
              <Mail className="h-8 w-8" />
            </div>
            
            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {hasGPTs ? (
                <>
                  Subscribe & Get Instant Access to All GPTs
                  <Bot className="inline-block h-6 w-6 ml-2 text-yellow-400" />
                </>
              ) : (
                "Stay Connected for More Resources"
              )}
            </h2>
            
            {/* Description */}
            <p className="text-primary-100 mb-8 leading-relaxed">
              {newsletterDescription || (hasGPTs 
                ? "Join our newsletter and receive immediate access to all AI tools and future updates from this talk."
                : "Get exclusive insights, resources, and updates delivered to your inbox."
              )}
            </p>

            {/* Form */}
            {!subscribed ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
                  required
                />
                <button
                  type="submit"
                  className="group px-6 py-3 bg-white text-primary-700 font-bold rounded-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Subscribe</span>
                  <Gift className="h-4 w-4 group-hover:animate-bounce" />
                </button>
              </form>
            ) : (
              <div className="bg-green-500/20 border-2 border-green-300/50 rounded-xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="bg-green-400 rounded-full p-1">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-bold text-lg">You're subscribed!</p>
                </div>
                <p className="text-primary-100">
                  Check your inbox for your access link to all GPT tools
                </p>
              </div>
            )}

            {/* Benefits */}
            {hasGPTs && !subscribed && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-primary-200">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4" />
                  Instant Access
                </span>
                <span className="flex items-center gap-1">
                  <Bot className="h-4 w-4" />
                  All AI Tools
                </span>
                <span className="flex items-center gap-1">
                  <Gift className="h-4 w-4" />
                  Future Updates
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}