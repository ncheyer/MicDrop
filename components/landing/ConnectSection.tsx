"use client";

import { useState } from "react";
import { Linkedin, Mail, Calendar, Send } from "lucide-react";

interface ConnectSectionProps {
  linkedinUrl?: string;
  contactEmail?: string;
  calendarLink?: string;
  newsletterEnabled?: boolean;
  newsletterDescription?: string;
  onNewsletterSignup: (email: string) => void;
  onContactClick: (type: string) => void;
}

export default function ConnectSection({
  linkedinUrl,
  contactEmail,
  calendarLink,
  newsletterEnabled,
  newsletterDescription,
  onNewsletterSignup,
  onContactClick,
}: ConnectSectionProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNewsletterSignup(email);
    setSubscribed(true);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Connect & Follow</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onContactClick("linkedin")}
              className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 hover:border-[#0077b5]/20"
            >
              <div className="bg-[#0077b5]/10 rounded-full p-3 mb-4 group-hover:bg-[#0077b5]/20 transition-colors">
                <Linkedin className="h-8 w-8 text-[#0077b5]" />
              </div>
              <span className="font-semibold text-gray-800">Connect on LinkedIn</span>
              <span className="text-sm text-gray-500 mt-1">Professional Network</span>
            </a>
          )}

          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              onClick={() => onContactClick("email")}
              className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 hover:border-primary-200"
            >
              <div className="bg-primary-100 rounded-full p-3 mb-4 group-hover:bg-primary-200 transition-colors">
                <Mail className="h-8 w-8 text-primary-600" />
              </div>
              <span className="font-semibold text-gray-800">Direct Email</span>
              <span className="text-sm text-gray-500 mt-1 break-all">{contactEmail}</span>
            </a>
          )}

          {calendarLink && (
            <a
              href={calendarLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onContactClick("calendar")}
              className="group flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100 hover:border-green-200"
            >
              <div className="bg-green-100 rounded-full p-3 mb-4 group-hover:bg-green-200 transition-colors">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <span className="font-semibold text-gray-800">Chat With Me!</span>
              <span className="text-sm text-gray-500 mt-1">Schedule Time</span>
            </a>
          )}
        </div>

        {newsletterEnabled && (
          <div className="bg-primary-600 text-white rounded-lg p-8">
            <div className="max-w-2xl mx-auto text-center">
              <Send className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-semibold mb-3">Stay Connected</h3>
              <p className="mb-6 text-primary-100">
                {newsletterDescription || "Join thousands getting weekly insights"}
              </p>
              
              {!subscribed ? (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              ) : (
                <div className="bg-green-500/20 border border-green-300 rounded-lg p-4">
                  <p className="font-medium">✓ You're subscribed!</p>
                  <p className="text-sm text-primary-100 mt-1">Check your inbox for confirmation</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}