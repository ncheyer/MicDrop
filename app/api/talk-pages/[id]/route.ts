import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET a single talk page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const talkPage = await prisma.talkPage.findFirst({
      where: { 
        id: params.id,
        userId // Ensure user owns this page
      },
      include: {
        customGpts: true,
        downloads: true,
        businessLinks: true,
      }
    });

    if (!talkPage) {
      return NextResponse.json(
        { error: 'Talk page not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(talkPage);
  } catch (error) {
    console.error('Error fetching talk page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch talk page' },
      { status: 500 }
    );
  }
}

// PUT update a talk page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();

    // Update the talk page
    const updatedPage = await prisma.talkPage.update({
      where: { 
        id: params.id,
      },
      data: {
        title: data.title,
        date: data.date ? new Date(data.date) : undefined,
        published: data.published,
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
        newsletterEnabled: data.newsletterEnabled,
        newsletterDescription: data.newsletterDescription,
        newsletterSignupUrl: data.newsletterSignupUrl,
      },
      include: {
        customGpts: true,
        downloads: true,
        businessLinks: true,
      }
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating talk page:', error);
    return NextResponse.json(
      { error: 'Failed to update talk page' },
      { status: 500 }
    );
  }
}

// DELETE a talk page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.cookies.get('userId')?.value;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete the talk page (cascade will delete related records)
    await prisma.talkPage.delete({
      where: { 
        id: params.id,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting talk page:', error);
    return NextResponse.json(
      { error: 'Failed to delete talk page' },
      { status: 500 }
    );
  }
}