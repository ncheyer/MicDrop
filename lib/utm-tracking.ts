/**
 * UTM Tracking Utilities
 * Automatically adds UTM parameters to track link performance
 */

interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content?: string;
  utm_term?: string;
}

/**
 * Add UTM parameters to a URL
 */
export function addUTMParams(url: string, params: UTMParams): string {
  try {
    const urlObj = new URL(url);
    
    // Add each UTM parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlObj.searchParams.set(key, value);
      }
    });
    
    return urlObj.toString();
  } catch (error) {
    // If URL is invalid, return original
    console.error('Invalid URL for UTM tracking:', url);
    return url;
  }
}

/**
 * Generate UTM parameters for a talk page link
 */
export function generateTalkPageUTM(
  talkSlug: string,
  linkType: 'gpt' | 'business' | 'social' | 'resource' | 'newsletter',
  linkName?: string
): UTMParams {
  return {
    utm_source: 'micdrop',
    utm_medium: 'speaker_page',
    utm_campaign: talkSlug,
    utm_content: linkName || linkType,
    utm_term: linkType
  };
}

/**
 * Track a link click in the database
 */
export async function trackLinkClick(
  talkPageId: string,
  linkType: string,
  linkName: string,
  destinationUrl: string
) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'link_click',
        talkPageId,
        data: {
          linkType,
          linkName,
          destinationUrl,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (error) {
    console.error('Error tracking link click:', error);
  }
}

/**
 * Track a page view
 */
export async function trackPageView(talkPageId: string, referrer?: string) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'page_view',
        talkPageId,
        data: {
          referrer,
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null
        }
      })
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Track email capture
 */
export async function trackEmailCapture(
  talkPageId: string,
  email: string,
  captureType: 'resources' | 'newsletter' | 'consultation'
) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'email_capture',
        talkPageId,
        data: {
          email,
          captureType,
          timestamp: new Date().toISOString()
        }
      })
    });
  } catch (error) {
    console.error('Error tracking email capture:', error);
  }
}