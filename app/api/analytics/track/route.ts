import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { event, talkPageId, data } = await request.json();

    // Store the analytics event
    await prisma.analytics.create({
      data: {
        event,
        talkPageId,
        data: data || {}
      }
    });

    // Update specific counters based on event type
    if (event === 'link_click' && data?.linkType === 'gpt') {
      // Update GPT click count
      const gptName = data.linkName;
      await prisma.customGPT.updateMany({
        where: { 
          talkPageId,
          name: gptName 
        },
        data: { 
          clickCount: { increment: 1 } 
        }
      });
    } else if (event === 'link_click' && data?.linkType === 'business') {
      // Update business link click count
      const businessName = data.linkName;
      await prisma.businessLink.updateMany({
        where: { 
          talkPageId,
          name: businessName 
        },
        data: { 
          clickCount: { increment: 1 } 
        }
      });
    } else if (event === 'link_click' && data?.linkType === 'resource') {
      // Update download count
      const resourceTitle = data.linkName;
      await prisma.download.updateMany({
        where: { 
          talkPageId,
          title: resourceTitle 
        },
        data: { 
          downloadCount: { increment: 1 } 
        }
      });
    } else if (event === 'email_capture') {
      // Store email capture (if not already exists)
      try {
        await prisma.emailCapture.create({
          data: {
            email: data.email,
            tier: data.captureType,
            talkPageId
          }
        });
      } catch (error) {
        // Email might already exist for this talk page, that's okay
        console.log('Email already captured for this talk page');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking analytics:', error);
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    );
  }
}

// GET analytics for a talk page
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

    // Get all analytics data
    const [
      pageViews,
      linkClicks,
      emailCaptures,
      customGpts,
      businessLinks,
      downloads
    ] = await Promise.all([
      // Count page views
      prisma.analytics.count({
        where: { 
          talkPageId,
          event: 'page_view' 
        }
      }),
      // Count total link clicks
      prisma.analytics.count({
        where: { 
          talkPageId,
          event: 'link_click' 
        }
      }),
      // Count email captures
      prisma.emailCapture.count({
        where: { talkPageId }
      }),
      // Get GPT stats
      prisma.customGPT.findMany({
        where: { talkPageId },
        select: {
          name: true,
          clickCount: true
        },
        orderBy: { clickCount: 'desc' }
      }),
      // Get business link stats
      prisma.businessLink.findMany({
        where: { talkPageId },
        select: {
          name: true,
          clickCount: true
        },
        orderBy: { clickCount: 'desc' }
      }),
      // Get download stats
      prisma.download.findMany({
        where: { talkPageId },
        select: {
          title: true,
          downloadCount: true
        },
        orderBy: { downloadCount: 'desc' }
      })
    ]);

    // Get recent activity
    const recentActivity = await prisma.analytics.findMany({
      where: { talkPageId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({
      overview: {
        pageViews,
        linkClicks,
        emailCaptures,
        conversionRate: pageViews > 0 ? ((emailCaptures / pageViews) * 100).toFixed(2) : 0
      },
      gpts: customGpts,
      businessLinks,
      downloads,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}