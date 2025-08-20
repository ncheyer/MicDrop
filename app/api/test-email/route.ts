import { NextRequest, NextResponse } from 'next/server';
import { sendTestEmail, sendWelcomeEmail } from '@/lib/resend';
import { getAbsoluteUrl } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { email, type = 'simple' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    if (type === 'simple') {
      // Send simple test email
      const result = await sendTestEmail(email);
      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully',
        emailId: result.emailId 
      });
    } else if (type === 'welcome') {
      // Send welcome email with sample tools
      const sampleTools = [
        {
          name: 'AI Strategy Builder GPT',
          description: 'Create comprehensive AI implementation strategies tailored to your business needs',
          url: 'https://chat.openai.com/g/g-example1',
          type: 'gpt' as const
        },
        {
          name: 'ROI Calculator GPT',
          description: 'Calculate the potential ROI of AI initiatives in your organization',
          url: 'https://chat.openai.com/g/g-example2',
          type: 'gpt' as const
        },
        {
          name: 'AI Implementation Framework',
          description: 'Step-by-step guide to implementing AI in your organization',
          url: 'https://speakaboutai.us/downloads/framework.pdf',
          type: 'download' as const
        },
        {
          name: 'Case Study Collection',
          description: '10 real-world AI success stories from various industries',
          url: 'https://speakaboutai.us/downloads/case-studies.pdf',
          type: 'download' as const
        },
        {
          name: 'AI Tools Directory',
          description: 'Curated list of 100+ AI tools for business',
          url: 'https://speakaboutai.us/resources/tools',
          type: 'resource' as const
        }
      ];

      const result = await sendWelcomeEmail({
        to: email,
        recipientName: 'Test User',
        speakerName: 'Noah Cheyer',
        speakerEmail: 'noah@speakaboutai.us',
        talkTitle: 'Implementing AI in Your Organization',
        tools: sampleTools,
        pageUrl: getAbsoluteUrl('/talk/test-page')
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Welcome email with tools sent successfully',
        emailId: result.emailId 
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid email type. Use "simple" or "welcome"' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint for testing via browser
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Test email endpoint',
    usage: 'POST to this endpoint with { email: "your@email.com", type: "simple" | "welcome" }',
    examples: [
      { email: 'test@example.com', type: 'simple' },
      { email: 'test@example.com', type: 'welcome' }
    ]
  });
}