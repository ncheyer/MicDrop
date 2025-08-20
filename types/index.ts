export interface TalkPageData {
  id?: string;
  slug: string;
  title: string;
  date: Date;
  hook?: string;
  speaker: {
    name: string;
    email: string;
    photo?: string;
    bio?: string;
    linkedinUrl?: string;
  };
  customGpts: Array<{
    name: string;
    description: string;
    url: string;
  }>;
  downloads: Array<{
    title: string;
    description?: string;
    fileUrl: string;
    requiresEmail: boolean;
  }>;
  businessLinks: Array<{
    name: string;
    description: string;
    url: string;
    ctaText: string;
  }>;
  keynoteNotesUrl?: string;
  keynoteSlidesUrl?: string;
  newsletter?: {
    enabled: boolean;
    description: string;
    signupUrl: string;
  };
  newsletterBannerUrl?: string;
  contactEmail?: string;
  calendarLink?: string;
}

export interface EmailSequence {
  emails: Array<{
    dayDelay: number;
    subject: string;
    content: string;
  }>;
}

export interface GeneratedContent {
  hook: string;
  gptDescriptions: Record<string, string>;
  businessDescriptions: Record<string, string>;
  personalBrandStatement: string;
  emailSequence: EmailSequence;
}