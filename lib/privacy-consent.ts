/**
 * Privacy Consent Management
 * GDPR and CCPA compliant consent handling
 */

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp?: string;
  version?: string;
}

export interface ConsentRecord {
  userId?: string;
  email?: string;
  preferences: ConsentPreferences;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  version: string;
  source: 'banner' | 'settings' | 'signup' | 'api';
}

const CONSENT_VERSION = "1.0";
const CONSENT_STORAGE_KEY = "micdrop-cookie-consent";
const CONSENT_RECORD_KEY = "micdrop-consent-record";

/**
 * Get current consent preferences from storage
 */
export function getConsentPreferences(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;
    
    const preferences = JSON.parse(stored);
    return {
      necessary: true, // Always true
      analytics: preferences.analytics || false,
      marketing: preferences.marketing || false,
      functional: preferences.functional || false,
      timestamp: preferences.timestamp,
      version: preferences.version,
    };
  } catch (error) {
    console.error("Error reading consent preferences:", error);
    return null;
  }
}

/**
 * Save consent preferences to storage
 */
export function saveConsentPreferences(
  preferences: ConsentPreferences,
  source: ConsentRecord['source'] = 'banner',
  userInfo?: { userId?: string; email?: string }
): void {
  if (typeof window === "undefined") return;

  const timestamp = new Date().toISOString();
  const preferencesWithMeta = {
    ...preferences,
    necessary: true, // Always true
    timestamp,
    version: CONSENT_VERSION,
  };

  // Save to localStorage
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferencesWithMeta));

  // Create detailed consent record
  const consentRecord: ConsentRecord = {
    ...userInfo,
    preferences: preferencesWithMeta,
    timestamp,
    ipAddress: undefined, // Will be filled server-side
    userAgent: navigator.userAgent,
    version: CONSENT_VERSION,
    source,
  };

  // Store consent record for compliance
  localStorage.setItem(CONSENT_RECORD_KEY, JSON.stringify(consentRecord));

  // Send to server for compliance logging
  recordConsentToServer(consentRecord).catch(console.error);

  // Trigger consent change event
  window.dispatchEvent(new CustomEvent("consentChanged", { 
    detail: preferencesWithMeta 
  }));
}

/**
 * Record consent to server for compliance
 */
async function recordConsentToServer(consentRecord: ConsentRecord): Promise<void> {
  try {
    await fetch("/api/privacy/consent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(consentRecord),
    });
  } catch (error) {
    console.error("Failed to record consent to server:", error);
  }
}

/**
 * Check if user has given consent for a specific purpose
 */
export function hasConsentFor(purpose: keyof ConsentPreferences): boolean {
  const preferences = getConsentPreferences();
  if (!preferences) return false;
  
  // Necessary cookies are always allowed
  if (purpose === "necessary") return true;
  
  return preferences[purpose] === true;
}

/**
 * Check if consent is required (no previous consent given)
 */
export function isConsentRequired(): boolean {
  const preferences = getConsentPreferences();
  return preferences === null;
}

/**
 * Get consent banner display status
 */
export function shouldShowConsentBanner(): boolean {
  // Don't show if user has already made a choice
  if (!isConsentRequired()) return false;
  
  // Don't show on admin pages
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/dashboard")) {
    return false;
  }
  
  return true;
}

/**
 * Withdraw all consent (for GDPR compliance)
 */
export function withdrawAllConsent(): void {
  const necessaryOnly: ConsentPreferences = {
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
  };
  
  saveConsentPreferences(necessaryOnly, 'settings');
  
  // Clear non-essential cookies
  clearNonEssentialCookies();
}

/**
 * Clear non-essential cookies when consent is withdrawn
 */
function clearNonEssentialCookies(): void {
  if (typeof document === "undefined") return;

  // List of non-essential cookie patterns
  const nonEssentialPatterns = [
    '_ga', '_gid', '_gat', // Google Analytics
    '_fbp', '_fbc', // Facebook Pixel
    'utm_', // UTM tracking
    '_hjid', '_hjIncludedInSessionSample', // Hotjar
  ];

  // Get all cookies
  const cookies = document.cookie.split(';');
  
  cookies.forEach(cookie => {
    const cookieName = cookie.trim().split('=')[0];
    
    // Check if cookie matches non-essential patterns
    const isNonEssential = nonEssentialPatterns.some(pattern => 
      cookieName.startsWith(pattern)
    );
    
    if (isNonEssential) {
      // Delete the cookie
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname}`;
    }
  });
}

/**
 * Enhanced email capture with privacy consent
 */
export interface EmailCaptureWithConsent {
  email: string;
  name?: string;
  marketingConsent: boolean;
  analyticsConsent: boolean;
  source: string;
  timestamp: string;
}

/**
 * Capture email with explicit privacy consent
 */
export async function captureEmailWithConsent(
  emailData: Omit<EmailCaptureWithConsent, 'timestamp'>
): Promise<void> {
  const timestamp = new Date().toISOString();
  
  const captureData: EmailCaptureWithConsent = {
    ...emailData,
    timestamp,
  };

  // Send to server
  await fetch("/api/privacy/email-capture", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(captureData),
  });

  // Update local consent if user opted in
  if (emailData.marketingConsent || emailData.analyticsConsent) {
    const currentPreferences = getConsentPreferences() || {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };

    const updatedPreferences = {
      ...currentPreferences,
      analytics: currentPreferences.analytics || emailData.analyticsConsent,
      marketing: currentPreferences.marketing || emailData.marketingConsent,
    };

    saveConsentPreferences(updatedPreferences, 'signup', { email: emailData.email });
  }
}

/**
 * CCPA - Do Not Sell implementation
 */
export function setDoNotSell(doNotSell: boolean): void {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("micdrop-do-not-sell", doNotSell.toString());
  
  // If user opts out, disable marketing and analytics
  if (doNotSell) {
    const currentPreferences = getConsentPreferences() || {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };

    const optedOutPreferences = {
      ...currentPreferences,
      analytics: false,
      marketing: false,
    };

    saveConsentPreferences(optedOutPreferences, 'settings');
  }

  // Notify server
  fetch("/api/privacy/do-not-sell", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ doNotSell }),
  }).catch(console.error);
}

/**
 * Get Do Not Sell preference
 */
export function getDoNotSellPreference(): boolean {
  if (typeof window === "undefined") return false;
  
  const doNotSell = localStorage.getItem("micdrop-do-not-sell");
  return doNotSell === "true";
}

/**
 * Age verification for consent (COPPA compliance)
 */
export function verifyAgeForConsent(birthDate: Date): boolean {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= 13;
  }
  
  return age >= 13;
}

/**
 * Get user's privacy dashboard data
 */
export interface PrivacyDashboardData {
  consentRecord: ConsentRecord | null;
  dataCollected: string[];
  retentionPeriods: Record<string, string>;
  thirdPartySharing: string[];
  rights: string[];
}

export async function getPrivacyDashboardData(): Promise<PrivacyDashboardData> {
  try {
    const response = await fetch("/api/privacy/dashboard");
    return await response.json();
  } catch (error) {
    console.error("Failed to load privacy dashboard data:", error);
    return {
      consentRecord: null,
      dataCollected: [],
      retentionPeriods: {},
      thirdPartySharing: [],
      rights: [],
    };
  }
}