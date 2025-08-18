import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

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

    // TODO: Send welcome email with resources
    // You can integrate with SendGrid, Resend, or other email services here

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