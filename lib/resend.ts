import { Resend } from 'resend';
import { generatePlainTextEmail, generateHtmlEmail } from './email-templates/tools-welcome';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendWelcomeEmailParams {
  to: string;
  recipientName?: string;
  speakerName: string;
  speakerEmail?: string;
  talkTitle: string;
  tools: Array<{
    name: string;
    description: string;
    url: string;
    type: 'gpt' | 'download' | 'resource';
  }>;
  pageUrl: string;
}

export async function sendWelcomeEmail({
  to,
  recipientName,
  speakerName,
  speakerEmail,
  talkTitle,
  tools,
  pageUrl
}: SendWelcomeEmailParams) {
  try {
    // Generate HTML content
    const htmlContent = generateHtmlEmail({
      recipientName,
      speakerName,
      talkTitle,
      tools,
      pageUrl
    });

    // Generate plain text content
    const textContent = generatePlainTextEmail({
      recipientName,
      speakerName,
      talkTitle,
      tools,
      pageUrl
    });

    // Determine the from address based on environment
    // In production, use a verified domain if available, otherwise fallback to Resend's domain
    const fromAddress = process.env.RESEND_FROM_EMAIL || 
                       (process.env.NODE_ENV === 'production' 
                         ? 'MicDrop <onboarding@resend.dev>' 
                         : 'Speak About AI <noreply@speakabout.ai>');

    console.log(`[Resend] Sending welcome email to: ${to}`);
    console.log(`[Resend] From address: ${fromAddress}`);
    console.log(`[Resend] Subject: Your AI Implementation Tools from "${talkTitle}"`);
    console.log(`[Resend] Tools count: ${tools.length}`);

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: `Your AI Implementation Tools from "${talkTitle}"`,
      html: htmlContent,
      text: textContent,
      replyTo: speakerEmail || undefined,
    });

    if (error) {
      console.error('[Resend] Error details:', {
        error,
        to,
        fromAddress,
        talkTitle
      });
      
      // If the error is about the from domain, try with fallback
      if (error.message?.includes('domain') && !fromAddress.includes('resend.dev')) {
        console.log('[Resend] Retrying with fallback domain...');
        const fallbackResult = await resend.emails.send({
          from: 'MicDrop <onboarding@resend.dev>',
          to: [to],
          subject: `Your AI Implementation Tools from "${talkTitle}"`,
          html: htmlContent,
          text: textContent,
          replyTo: speakerEmail || undefined,
        });
        
        if (fallbackResult.error) {
          throw new Error(`Failed to send email even with fallback: ${fallbackResult.error.message}`);
        }
        
        console.log('[Resend] Email sent successfully with fallback domain');
        return { success: true, emailId: fallbackResult.data?.id };
      }
      
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log(`[Resend] Email sent successfully! ID: ${data?.id}`);
    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('[Resend] Critical error sending welcome email:', error);
    throw error;
  }
}

// Send a simple notification email (for testing)
export async function sendTestEmail(to: string) {
  try {
    const fromAddress = process.env.RESEND_FROM_EMAIL || 
                       (process.env.NODE_ENV === 'production' 
                         ? 'MicDrop <onboarding@resend.dev>' 
                         : 'Speak About AI <noreply@speakabout.ai>');

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: 'Test Email from MicDrop',
      html: '<p>This is a test email from your MicDrop platform.</p>',
      text: 'This is a test email from your MicDrop platform.',
    });

    if (error) {
      console.error('Resend error:', error);
      
      // Try fallback if needed
      if (error.message?.includes('domain') && !fromAddress.includes('resend.dev')) {
        const fallbackResult = await resend.emails.send({
          from: 'MicDrop <onboarding@resend.dev>',
          to: [to],
          subject: 'Test Email from MicDrop',
          html: '<p>This is a test email from your MicDrop platform.</p>',
          text: 'This is a test email from your MicDrop platform.',
        });
        
        if (fallbackResult.error) {
          throw new Error(`Failed to send test email even with fallback: ${fallbackResult.error.message}`);
        }
        
        return { success: true, emailId: fallbackResult.data?.id };
      }
      
      throw new Error(`Failed to send test email: ${error.message}`);
    }

    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
}