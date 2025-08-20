// Site configuration
export const siteConfig = {
  // Use the production URL in production, localhost in development
  url: process.env.NEXT_PUBLIC_SITE_URL || 
       (process.env.NODE_ENV === 'production' 
         ? 'https://v0-landing-page-analysis.vercel.app' 
         : 'http://localhost:3000'),
  
  name: 'MicDrop',
  description: 'Speaker Landing Pages by Speak About AI',
};

export function getAbsoluteUrl(path: string = '') {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}