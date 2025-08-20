import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/resend';
import { getAbsoluteUrl } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const { talkPageId, email, name, tier } = await request.json();

    // Validate required fields
    if (!talkPageId || !email || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists for this talk page
    const existingCapture = await prisma.emailCapture.findUnique({
      where: {
        email_talkPageId: {
          email,
          talkPageId
        }
      }
    });

    if (existingCapture) {
      // Email already captured, just return success
      return NextResponse.json({ 
        success: true, 
        message: 'Email already captured',
        isNew: false 
      });
    }

    // Create new email capture
    const emailCapture = await prisma.emailCapture.create({
      data: {
        email,
        name,
        tier,
        talkPageId
      }
    });

    // Also track in analytics
    await prisma.analytics.create({
      data: {
        event: 'email_capture',
        talkPageId,
        data: {
          email,
          tier,
          timestamp: new Date().toISOString()
        }
      }
    });

    // Fetch the talk page with all resources to send in email
    const talkPage = await prisma.talkPage.findUnique({
      where: { id: talkPageId },
      include: {
        customGpts: {
          orderBy: { order: 'asc' }
        },
        downloads: {
          orderBy: { order: 'asc' }
        },
        businessLinks: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (talkPage) {
      // Prepare tools array for email
      const tools = [
        ...talkPage.customGpts.map(gpt => ({
          name: gpt.name,
          description: gpt.description,
          url: gpt.url,
          type: 'gpt' as const
        })),
        ...talkPage.downloads.map(download => ({
          name: download.title,
          description: download.description || '',
          url: download.fileUrl,
          type: 'download' as const
        })),
        ...talkPage.businessLinks.map(link => ({
          name: link.name,
          description: link.description,
          url: link.url,
          type: 'resource' as const
        }))
      ];

      console.log('Preparing to send email with:', {
        to: email,
        talkTitle: talkPage.title,
        speakerName: talkPage.speakerName,
        resourceCount: {
          gpts: talkPage.customGpts.length,
          downloads: talkPage.downloads.length,
          businessLinks: talkPage.businessLinks.length,
          total: tools.length
        }
      });

      // Send welcome email with resources
      try {
        const emailResult = await sendWelcomeEmail({
          to: email,
          recipientName: name || undefined,
          speakerName: talkPage.speakerName,
          speakerEmail: talkPage.speakerEmail || undefined,
          talkTitle: talkPage.title,
          tools,
          pageUrl: getAbsoluteUrl(`/talk/${talkPage.slug}`)
        });
        console.log('Welcome email sent successfully:', {
          to: email,
          emailId: emailResult.emailId,
          talkPage: talkPage.title
        });
      } catch (emailError: any) {
        // Log detailed error information
        console.error('Failed to send welcome email:', {
          error: emailError.message || emailError,
          to: email,
          talkPageId: talkPage.id,
          talkTitle: talkPage.title,
          stack: emailError.stack
        });
        // You might want to track this failure or retry later
      }
    } else {
      console.warn('Talk page not found for email capture:', {
        talkPageId,
        email
      });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email captured successfully',
      isNew: true
    });
  } catch (error) {
    console.error('Error capturing email:', error);
    return NextResponse.json(
      { error: 'Failed to capture email' },
      { status: 500 }
    );
  }
}

// GET emails for a talk page (for dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const talkPageId = searchParams.get('talkPageId');
    const userId = request.cookies.get('userId')?.value;

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!talkPageId) {
      return NextResponse.json(
        { error: 'Talk page ID required' },
        { status: 400 }
      );
    }

    // Verify user owns this talk page
    const talkPage = await prisma.talkPage.findFirst({
      where: { 
        id: talkPageId,
        userId 
      }
    });

    if (!talkPage) {
      return NextResponse.json(
        { error: 'Talk page not found' },
        { status: 404 }
      );
    }

    // Get all email captures
    const emailCaptures = await prisma.emailCapture.findMany({
      where: { talkPageId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(emailCaptures);
  } catch (error) {
    console.error('Error fetching email captures:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email captures' },
      { status: 500 }
    );
  }
}