/**
 * Lead Capture Utilities
 * Manages email capture state and triggers
 */

const COOKIE_NAME = 'micdrop_lead';
const COOKIE_DAYS = 30;

/**
 * Check if user has already been captured for this talk page
 */
export function hasUserBeenCaptured(talkSlug: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const cookies = document.cookie.split(';');
    const leadCookie = cookies.find(c => c.trim().startsWith(`${COOKIE_NAME}_${talkSlug}=`));
    return !!leadCookie;
  } catch {
    return false;
  }
}

/**
 * Mark user as captured for this talk page
 */
export function markUserAsCaptured(talkSlug: string, email: string): void {
  if (typeof window === 'undefined') return;
  
  const date = new Date();
  date.setTime(date.getTime() + (COOKIE_DAYS * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  
  // Store a hashed version of email for privacy
  const hashedEmail = btoa(email).substring(0, 10);
  document.cookie = `${COOKIE_NAME}_${talkSlug}=${hashedEmail}; ${expires}; path=/`;
}

/**
 * Check if user should see the lead capture modal
 */
export function shouldShowLeadCapture(
  talkSlug: string,
  timeOnPage: number,
  scrollDepth: number,
  clickedPremiumContent: boolean
): boolean {
  // Don't show if already captured
  if (hasUserBeenCaptured(talkSlug)) {
    return false;
  }

  // Show if user clicked on premium content
  if (clickedPremiumContent) {
    return true;
  }

  // Show after 15 seconds on page
  if (timeOnPage > 15000) {
    return true;
  }

  // Show if scrolled past 60% of page
  if (scrollDepth > 0.6) {
    return true;
  }

  return false;
}

/**
 * Track scroll depth
 */
export function getScrollDepth(): number {
  if (typeof window === 'undefined') return 0;
  
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  
  if (scrollHeight === 0) return 0;
  return scrollTop / scrollHeight;
}

/**
 * Content gating levels
 */
export interface ContentGatingRules {
  showBasicInfo: boolean;         // Always true - name, title, date
  showFirstGPT: boolean;          // Show first GPT as teaser
  showAllGPTs: boolean;           // Requires email
  showFirstResource: boolean;     // Show first resource as teaser
  showAllResources: boolean;      // Requires email
  showBusinessLinks: boolean;     // Always visible to drive traffic
  allowDownloads: boolean;        // Requires email
  showFullBio: boolean;          // Requires email
}

/**
 * Get content access rules based on capture status
 */
export function getContentAccess(talkSlug: string): ContentGatingRules {
  const isCaptured = hasUserBeenCaptured(talkSlug);
  
  return {
    showBasicInfo: true,
    showFirstGPT: true,
    showAllGPTs: isCaptured,
    showFirstResource: true,
    showAllResources: isCaptured,
    showBusinessLinks: true,
    allowDownloads: isCaptured,
    showFullBio: isCaptured,
  };
}

/**
 * Exit intent detection
 */
export function detectExitIntent(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleMouseLeave = (e: MouseEvent) => {
    // Trigger when mouse leaves viewport from top (suggesting exit)
    if (e.clientY <= 0) {
      callback();
    }
  };

  document.addEventListener('mouseleave', handleMouseLeave);
  
  // Return cleanup function
  return () => {
    document.removeEventListener('mouseleave', handleMouseLeave);
  };
}