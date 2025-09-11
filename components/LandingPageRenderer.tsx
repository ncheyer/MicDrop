"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronDown, 
  Star, 
  Check, 
  ArrowRight,
  Play,
  Download,
  ExternalLink,
  Mail,
  Calendar,
  Users,
  Zap,
  Shield,
  Award
} from 'lucide-react';

interface LandingPageData {
  id: string;
  title: string;
  description?: string | null | undefined;
  type: string;
  sections: Section[];
  customGpts?: GPT[];
  talkPage?: any;
  user?: {
    name?: string | null;
    email?: string;
  };
}

interface GPT {
  id: string;
  name: string;
  description: string;
  url: string;
  clickCount: number;
  order: number;
}

interface Section {
  id: string;
  type: string;
  title?: string | null;
  subtitle?: string | null;
  content?: any;
  backgroundImage?: string | null;
  backgroundColor?: string | null;
  videoUrl?: string | null;
  customCss?: string | null;
  customHtml?: string | null;
}

export default function LandingPageRenderer({ data }: { data: LandingPageData }) {
  const [email, setEmail] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 3000);
    setEmail('');
  };

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'hero':
        return renderHeroSection(section);
      case 'features':
        return renderFeaturesSection(section);
      case 'gpts':
        return renderGPTsSection(section);
      case 'cta':
        return renderCTASection(section);
      case 'testimonials':
        return renderTestimonialsSection(section);
      case 'faq':
        return renderFAQSection(section);
      case 'custom':
        return renderCustomSection(section);
      default:
        return null;
    }
  };

  const renderHeroSection = (section: Section) => {
    const content = section.content || {};
    return (
      <section
        className="relative min-h-screen flex items-center justify-center px-4 py-20"
        style={{
          backgroundColor: section.backgroundColor || '#ffffff',
          backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } as React.CSSProperties}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            {content.headline || section.title || 'Welcome'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {content.subheadline || section.subtitle || ''}
          </p>
          {content.ctaText && (
            <Link href={content.ctaLink || '#'}>
              <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                {content.ctaText}
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          )}
          {section.videoUrl && (
            <div className="mt-12">
              <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
                <iframe
                  src={section.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </section>
    );
  };

  const renderFeaturesSection = (section: Section) => {
    const content = section.content || {};
    const features = content.features || [];
    
    const icons = [Zap, Shield, Award];

    return (
      <section className="py-20 px-4" style={{ backgroundColor: section.backgroundColor as any || '#f9fafb' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {section.title || 'Features'}
            </h2>
            <p className="text-xl text-gray-600">
              {section.subtitle || ''}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature: any, index: number) => {
              const Icon = icons[index % icons.length];
              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <Icon className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  const renderGPTsSection = (section: Section) => {
    const gpts = section.content?.gpts || [];
    
    // Also check for GPTs from the main data if this is a talk page
    const mainGpts = data.customGpts || [];
    const allGpts = gpts.length > 0 ? gpts : mainGpts;
    
    if (allGpts.length === 0) return null;

    return (
      <section className="py-20 px-4" style={{ backgroundColor: section.backgroundColor as any || '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {section.title || 'AI Tools & GPTs'}
            </h2>
            <p className="text-xl text-gray-600">
              {section.subtitle || 'Explore our custom AI assistants'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allGpts.map((gpt: any, index: number) => (
              <a
                key={gpt.id || index}
                href={gpt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <ExternalLink className="h-6 w-6 text-blue-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {gpt.name}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {gpt.description}
                </p>
                <div className="mt-4 text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it now →
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderCTASection = (section: Section) => {
    const content = section.content || {};
    
    return (
      <section 
        className="py-20 px-4"
        style={{ 
          backgroundColor: section.backgroundColor || '#1e40af',
          backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } as React.CSSProperties}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            {content.headline || section.title || 'Ready to Get Started?'}
          </h2>
          {section.subtitle && (
            <p className="text-xl text-white/90 mb-8">
              {section.subtitle}
            </p>
          )}
          
          {data.type === 'talk' ? (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              {showThankYou && (
                <p className="mt-4 text-white">Thank you for subscribing!</p>
              )}
            </form>
          ) : (
            <Link href={content.buttonLink || '#'}>
              <button className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-full hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                {content.buttonText || 'Get Started'}
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
          )}
        </div>
      </section>
    );
  };

  const renderTestimonialsSection = (section: Section) => {
    const content = section.content || {};
    const testimonials = content.testimonials || [];

    return (
      <section className="py-20 px-4" style={{ backgroundColor: section.backgroundColor as any || '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {section.title || 'What People Say'}
            </h2>
            <p className="text-xl text-gray-600">
              {section.subtitle || ''}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderFAQSection = (section: Section) => {
    const content = section.content || {};
    const questions = content.questions || [];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
      <section className="py-20 px-4" style={{ backgroundColor: section.backgroundColor as any || '#f9fafb' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {section.title || 'Frequently Asked Questions'}
            </h2>
            <p className="text-xl text-gray-600">
              {section.subtitle || ''}
            </p>
          </div>
          <div className="space-y-4">
            {questions.map((faq: any, index: number) => (
              <div key={index} className="bg-white rounded-lg shadow-sm">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  const renderCustomSection = (section: Section) => {
    if (section.customHtml) {
      return (
        <section
          style={{
            backgroundColor: section.backgroundColor as any,
            backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined
          }}
          dangerouslySetInnerHTML={{ __html: section.customHtml }}
        />
      );
    }

    return (
      <section
        className="py-20 px-4"
        style={{
          backgroundColor: section.backgroundColor || '#ffffff',
          backgroundImage: section.backgroundImage ? `url(${section.backgroundImage})` : undefined
        } as React.CSSProperties}
      >
        <div className="max-w-6xl mx-auto">
          {section.title && (
            <h2 className="text-4xl font-bold mb-4 text-center text-gray-900">
              {section.title}
            </h2>
          )}
          {section.subtitle && (
            <p className="text-xl text-center text-gray-600 mb-8">
              {section.subtitle}
            </p>
          )}
        </div>
      </section>
    );
  };

  // Special rendering for talk landing pages with integrated talk features
  const renderTalkFeatures = () => {
    if (data.type !== 'talk' || !data.talkPage) return null;

    return (
      <>
        {/* Custom GPTs Section */}
        {data.talkPage.customGpts && data.talkPage.customGpts.length > 0 && (
          <section className="py-20 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">AI Tools & Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.talkPage.customGpts.map((gpt: any) => (
                  <Link key={gpt.id} href={gpt.url} target="_blank">
                    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                      <h3 className="text-xl font-semibold mb-2">{gpt.name}</h3>
                      <p className="text-gray-600 mb-4">{gpt.description}</p>
                      <span className="text-blue-600 font-medium inline-flex items-center gap-1">
                        Try it now <ExternalLink className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Downloads Section */}
        {data.talkPage.downloads && data.talkPage.downloads.length > 0 && (
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl font-bold mb-12 text-center">Downloads</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.talkPage.downloads.map((download: any) => (
                  <div key={download.id} className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{download.title}</h3>
                        {download.description && (
                          <p className="text-gray-600 mb-4">{download.description}</p>
                        )}
                      </div>
                      <Link href={download.fileUrl} target="_blank">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Render all sections in order */}
      {data.sections.map((section) => (
        <div key={section.id}>
          {renderSection(section)}
        </div>
      ))}

      {/* Add talk-specific features if applicable */}
      {renderTalkFeatures()}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-4">{data.title}</p>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {data.user?.name || 'All rights reserved'}
          </p>
        </div>
      </footer>
    </div>
  );
}