import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all talk pages for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const talkPages = await prisma.talkPage.findMany({
      where: { userId },
      include: {
        customGpts: true,
        downloads: true,
        businessLinks: true,
        _count: {
          select: {
            emailCaptures: true,
            analytics: {
              where: { event: 'page_view' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(talkPages);
  } catch (error) {
    console.error('Error fetching talk pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch talk pages' },
      { status: 500 }
    );
  }
}

// POST create a new talk page
export async function POST(request: NextRequest) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + 
      '-' + Date.now().toString(36);

    const talkPage = await prisma.talkPage.create({
      data: {
        slug,
        title: data.title,
        date: new Date(data.date),
        speakerName: data.speakerName,
        speakerEmail: data.speakerEmail,
        speakerPhoto: data.speakerPhoto,
        speakerBio: data.speakerBio,
        speakerLinkedIn: data.speakerLinkedIn,
        hook: data.hook,
        keynoteNotesUrl: data.keynoteNotesUrl,
        keynoteSlidesUrl: data.keynoteSlidesUrl,
        contactEmail: data.contactEmail,
        calendarLink: data.calendarLink,
        newsletterEnabled: data.newsletterEnabled || false,
        newsletterDescription: data.newsletterDescription,
        newsletterSignupUrl: data.newsletterSignupUrl,
        published: data.published || false,
        userId,
        customGpts: {
          create: data.customGpts || []
        },
        downloads: {
          create: data.downloads || []
        },
        businessLinks: {
          create: data.businessLinks || []
        }
      },
      include: {
        customGpts: true,
        downloads: true,
        businessLinks: true
      }
    });

    return NextResponse.json(talkPage);
  } catch (error) {
    console.error('Error creating talk page:', error);
    return NextResponse.json(
      { error: 'Failed to create talk page' },
      { status: 500 }
    );
  }
}