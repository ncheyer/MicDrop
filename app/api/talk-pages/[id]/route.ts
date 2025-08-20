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

    // Use a transaction to update everything atomically
    const updatedPage = await prisma.$transaction(async (tx) => {
      // First, update the main talk page
      const page = await tx.talkPage.update({
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
          newsletterBannerUrl: data.newsletterBannerUrl,
        },
      });

      // Delete existing custom GPTs and recreate them
      if (data.customGpts) {
        await tx.customGPT.deleteMany({
          where: { talkPageId: params.id }
        });
        
        if (data.customGpts.length > 0) {
          await tx.customGPT.createMany({
            data: data.customGpts.map((gpt: any, index: number) => ({
              name: gpt.name,
              description: gpt.description,
              url: gpt.url,
              order: gpt.order ?? index,
              talkPageId: params.id,
            }))
          });
        }
      }

      // Delete existing downloads and recreate them
      if (data.downloads) {
        await tx.download.deleteMany({
          where: { talkPageId: params.id }
        });
        
        if (data.downloads.length > 0) {
          await tx.download.createMany({
            data: data.downloads.map((download: any, index: number) => ({
              title: download.title,
              description: download.description,
              fileUrl: download.fileUrl,
              requiresEmail: download.requiresEmail ?? false,
              order: download.order ?? index,
              talkPageId: params.id,
            }))
          });
        }
      }

      // Delete existing business links and recreate them
      if (data.businessLinks) {
        await tx.businessLink.deleteMany({
          where: { talkPageId: params.id }
        });
        
        if (data.businessLinks.length > 0) {
          await tx.businessLink.createMany({
            data: data.businessLinks.map((link: any, index: number) => ({
              name: link.name,
              description: link.description,
              url: link.url,
              ctaText: link.ctaText || "Learn More",
              order: link.order ?? index,
              talkPageId: params.id,
            }))
          });
        }
      }

      // Return the updated page with all relations
      return await tx.talkPage.findUnique({
        where: { id: params.id },
        include: {
          customGpts: true,
          downloads: true,
          businessLinks: true,
        }
      });
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