"use client";

import { useEffect, useState, useRef } from "react";
import HeroSection from "@/components/landing/HeroSection";
import ResourcesAndNewsletterSection from "@/components/landing/ResourcesAndNewsletterSection";
import AboutSection from "@/components/landing/AboutSection";
import ConnectSection from "@/components/landing/ConnectSection";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { TalkPageData } from "@/types";
import { 
  trackPageView, 
  trackLinkClick, 
  trackEmailCapture,
} from "@/lib/utm-tracking";
import {
  hasUserBeenCaptured,
  markUserAsCaptured,
  shouldShowLeadCapture,
  getScrollDepth,
  getContentAccess,
  detectExitIntent,
} from "@/lib/lead-capture";
import { Lock } from "lucide-react";

interface ClientPageProps {
  initialData: TalkPageData & { id: string; isOwner?: boolean };
}

export default function TalkPageClient({ initialData }: ClientPageProps) {
  const [talkData] = useState(initialData);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [contentAccess, setContentAccess] = useState(() => 
    initialData.isOwner 
      ? { showAllGPTs: true, showAllResources: true, allowDownloads: true, showFullBio: true }
      : getContentAccess(talkData.slug)
  );
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const scrollCheckInterval = useRef<NodeJS.Timeout>();
  const timeInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Track page view
    if (!hasTrackedView && talkData.id) {
      trackPageView(talkData.id, document.referrer);
      setHasTrackedView(true);
    }

    // Remove automatic triggers - only show modal when user clicks on resources
    return () => {};
  }, [talkData, hasTrackedView]);

  const handleGetResources = () => {
    // Scroll to newsletter section to get access to GPTs
    const newsletterSection = document.getElementById("newsletter");
    if (newsletterSection) {
      newsletterSection.scrollIntoView({ behavior: "smooth" });
    } else {
      document.getElementById("resources")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGPTClick = (name: string) => {
    console.log('GPT clicked:', { 
      name, 
      showAllGPTs: contentAccess.showAllGPTs, 
      isOwner: initialData.isOwner,
      shouldBlock: !contentAccess.showAllGPTs && !initialData.isOwner
    });
    
    // Require email capture before accessing GPTs
    if (!contentAccess.showAllGPTs && !initialData.isOwner) {
      setShowLeadCapture(true);
      return;
    }
    // Track and open GPT
    trackLinkClick(talkData.id, "gpt", name, "");
    const gpt = talkData.customGpts.find(g => g.name === name);
    if (gpt) {
      window.open(gpt.url, "_blank");
    }
  };

  const handleDownload = (title: string, requiresEmail: boolean) => {
    if ((!contentAccess.allowDownloads || requiresEmail) && !initialData.isOwner) {
      setShowLeadCapture(true);
      return;
    }
    trackLinkClick(talkData.id, "resource", title, "");
  };

  const handleBusinessLinkClick = (name: string) => {
    const businessLink = talkData.businessLinks.find(link => link.name === name);
    const destinationUrl = businessLink ? businessLink.url : "";
    trackLinkClick(talkData.id, "business", name, destinationUrl);
  };

  const handleNewsletterSignup = async (email: string) => {
    await trackEmailCapture(talkData.id, email, "newsletter");
    
    // Save email to database
    await fetch("/api/email-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        talkPageId: talkData.id,
        email,
        name: "",
        tier: "newsletter",
      }),
    });
    
    markUserAsCaptured(talkData.slug, email);
    setContentAccess({
      showAllGPTs: true,
      showAllResources: true,
      allowDownloads: true,
      showFullBio: true
    });
  };

  const handleContactClick = (type: string) => {
    trackLinkClick(talkData.id, "social", type, "");
  };

  const handleLeadCaptureSubmit = async (email: string, name?: string) => {
    // Track the capture
    await trackEmailCapture(talkData.id, email, "resources");
    
    // Save email to database
    await fetch("/api/email-capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        talkPageId: talkData.id,
        email,
        name,
        tier: "resources",
      }),
    });

    // Mark as captured and update access
    markUserAsCaptured(talkData.slug, email);
    setContentAccess(getContentAccess(talkData.slug));
    setShowLeadCapture(false);
  };

  // Filter resources based on access level
  // Show all GPTs but clicking requires email
  const visibleGpts = talkData.customGpts;

  const visibleDownloads = contentAccess.showAllResources
    ? talkData.downloads
    : talkData.downloads.slice(0, 1);

  return (
    <div className="min-h-screen">
      <HeroSection
        title={talkData.title}
        date={talkData.date.toISOString()}
        speakerName={talkData.speaker.name}
        speakerPhoto={talkData.speaker.photo}
        hook={talkData.hook || ""}
        onGetResources={handleGetResources}
      />

      <ResourcesAndNewsletterSection
        customGpts={visibleGpts}
        downloads={visibleDownloads}
        newsletterEnabled={talkData.newsletter?.enabled}
        newsletterDescription={talkData.newsletter?.description}
        newsletterBannerUrl={talkData.newsletterBannerUrl}
        onGPTClick={handleGPTClick}
        onDownload={handleDownload}
        onNewsletterSignup={handleNewsletterSignup}
        totalGpts={talkData.customGpts.length}
        totalDownloads={talkData.downloads.length}
        isLocked={!contentAccess.showAllResources && !initialData.isOwner}
      />

      {/* Gated content indicator */}
      {!contentAccess.showAllResources && !initialData.isOwner && (
        <div className="bg-gradient-to-b from-gray-50 to-white py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full mb-4">
              <Lock className="h-4 w-4" />
              <span className="text-sm font-medium">
                {talkData.customGpts.length - 1} more GPTs and {talkData.downloads.length - 1} more resources available
              </span>
            </div>
            <button
              onClick={() => setShowLeadCapture(true)}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Unlock All Resources
            </button>
          </div>
        </div>
      )}

      <AboutSection
        speakerName={talkData.speaker.name}
        speakerPhoto={talkData.speaker.photo}
        speakerBio={contentAccess.showFullBio ? talkData.speaker.bio : 
          talkData.speaker.bio ? talkData.speaker.bio.substring(0, 150) + "..." : undefined}
        businessLinks={talkData.businessLinks}
        onBusinessLinkClick={handleBusinessLinkClick}
        talkSlug={talkData.slug}
      />

      <ConnectSection
        linkedinUrl={talkData.speaker.linkedinUrl}
        contactEmail={talkData.contactEmail}
        calendarLink={talkData.calendarLink}
        newsletterEnabled={false}
        newsletterDescription=""
        onNewsletterSignup={handleNewsletterSignup}
        onContactClick={handleContactClick}
      />

      <LeadCaptureModal
        isOpen={showLeadCapture}
        onClose={() => setShowLeadCapture(false)}
        onSubmit={handleLeadCaptureSubmit}
        speakerName={talkData.speaker.name}
        talkTitle={talkData.title}
        resourceCount={talkData.downloads.length}
        gptCount={talkData.customGpts.length}
      />

      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm">
            Powered by{" "}
            <a href="/" className="text-primary-400 hover:text-primary-300">
              MicDrop by Speak About AI
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}