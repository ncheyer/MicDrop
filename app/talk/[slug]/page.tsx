"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/landing/HeroSection";
import ResourcesSection from "@/components/landing/ResourcesSection";
import AboutSection from "@/components/landing/AboutSection";
import ConnectSection from "@/components/landing/ConnectSection";
import { TalkPageData } from "@/types";

// Sample data for demo - replace with API call
const SAMPLE_TALK_DATA: TalkPageData = {
  slug: "ai-events-2025",
  title: "AI in Events: Transform Your Operations in 30 Days",
  date: new Date("2025-01-15"),
  speaker: {
    name: "Noah Cheyer",
    email: "noah@speakaboutai.com",
    bio: "Founder of Speak About AI, the only AI-exclusive speaker bureau. I help event professionals save 10+ hours weekly through strategic AI implementation, while connecting organizations with transformative AI speakers.",
    linkedinUrl: "https://linkedin.com/in/noahcheyer",
  },
  customGpts: [
    {
      name: "Timeline Generator GPT",
      description: "Turn 4-hour timeline creation into 30 minutes. Built specifically for event professionals managing complex multi-stakeholder events.",
      url: "https://chat.openai.com/g/g-example1",
    },
    {
      name: "AI Event Twin",
      description: "Your communications co-pilot that drafts emails, social posts, and attendee messages in your voice.",
      url: "https://chat.openai.com/g/g-example2",
    },
    {
      name: "Market Research GPT",
      description: "Competitor analysis and trend research in seconds instead of hours.",
      url: "https://chat.openai.com/g/g-example3",
    },
  ],
  downloads: [
    {
      title: "AI Readiness Assessment (PDF)",
      description: "Evaluate your organization's readiness for AI implementation",
      fileUrl: "/downloads/ai-readiness.pdf",
      requiresEmail: true,
    },
    {
      title: "Implementation Guides",
      description: "Step-by-step guides for integrating AI into your workflow",
      fileUrl: "/downloads/implementation-guide.pdf",
      requiresEmail: true,
    },
    {
      title: "Full Keynote Notes",
      description: "Complete notes and references from the presentation",
      fileUrl: "/downloads/keynote-notes.pdf",
      requiresEmail: false,
    },
  ],
  businessLinks: [
    {
      name: "Speak About AI",
      description: "As the only AI-exclusive speaker bureau, we connect organizations with world-class AI experts who are actively shaping the field. Perfect for conferences, corporate events, and executive education.",
      url: "https://speakaboutai.com",
      ctaText: "Book an AI Speaker",
    },
  ],
  newsletter: {
    enabled: true,
    description: "Join 2,000+ event professionals getting weekly AI insights",
    signupUrl: "/newsletter",
  },
  contactEmail: "noah@speakaboutai.com",
  calendarLink: "https://calendly.com/noah",
};

export default function TalkPage({ params }: { params: { slug: string } }) {
  const [talkData, setTalkData] = useState<TalkPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API
    setTimeout(() => {
      setTalkData(SAMPLE_TALK_DATA);
      setLoading(false);
    }, 500);
  }, [params.slug]);

  const handleGetResources = () => {
    document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleGPTClick = (name: string) => {
    console.log("GPT clicked:", name);
    // Track analytics
  };

  const handleDownload = (title: string, requiresEmail: boolean) => {
    console.log("Download:", title, "Email required:", requiresEmail);
    // Track analytics
  };

  const handleBusinessLinkClick = (name: string) => {
    console.log("Business link clicked:", name);
    // Track analytics
  };

  const handleNewsletterSignup = (email: string) => {
    console.log("Newsletter signup:", email);
    // Submit to API
  };

  const handleContactClick = (type: string) => {
    console.log("Contact clicked:", type);
    // Track analytics
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!talkData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">This talk page doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection
        title={talkData.title}
        date={talkData.date.toISOString()}
        speakerName={talkData.speaker.name}
        speakerPhoto={talkData.speaker.photo}
        hook="Transform your event operations with AI tools that save 10+ hours weekly while delivering exceptional attendee experiences."
        onGetResources={handleGetResources}
      />

      <ResourcesSection
        customGpts={talkData.customGpts}
        downloads={talkData.downloads}
        onGPTClick={handleGPTClick}
        onDownload={handleDownload}
      />

      <AboutSection
        speakerName={talkData.speaker.name}
        speakerPhoto={talkData.speaker.photo}
        speakerBio={talkData.speaker.bio}
        businessLinks={talkData.businessLinks}
        onBusinessLinkClick={handleBusinessLinkClick}
      />

      <ConnectSection
        linkedinUrl={talkData.speaker.linkedinUrl}
        contactEmail={talkData.contactEmail}
        calendarLink={talkData.calendarLink}
        newsletterEnabled={talkData.newsletter?.enabled}
        newsletterDescription={talkData.newsletter?.description}
        onNewsletterSignup={handleNewsletterSignup}
        onContactClick={handleContactClick}
      />

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm">
            Powered by{" "}
            <a href="/" className="text-primary-400 hover:text-primary-300">
              MicDrop
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}