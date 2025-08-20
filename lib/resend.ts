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

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: speakerEmail && speakerEmail.includes('@') 
        ? `${speakerName} <${speakerEmail}>`
        : 'Speak About AI <noreply@speakaboutai.us>',
      to: [to],
      subject: `Your AI Implementation Tools from "${talkTitle}"`,
      html: htmlContent,
      text: textContent,
      replyTo: speakerEmail || undefined,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

// Send a simple notification email (for testing)
export async function sendTestEmail(to: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Speak About AI <noreply@speakaboutai.us>',
      to: [to],
      subject: 'Test Email from MicDrop',
      html: '<p>This is a test email from your MicDrop platform.</p>',
      text: 'This is a test email from your MicDrop platform.',
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(`Failed to send test email: ${error.message}`);
    }

    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
}