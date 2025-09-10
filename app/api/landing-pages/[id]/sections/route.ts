import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

// POST /api/landing-pages/[id]/sections - Add a new section
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns this landing page
    const landingPage = await prisma.landingPage.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });

    if (!landingPage || landingPage.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      type,
      title,
      subtitle,
      content,
      backgroundImage,
      backgroundColor,
      videoUrl,
      order,
      visible = true,
      customCss,
      customHtml
    } = body;

    // Get the max order if not specified
    let sectionOrder = order;
    if (sectionOrder === undefined) {
      const maxOrder = await prisma.landingPageSection.findFirst({
        where: { landingPageId: params.id },
        orderBy: { order: 'desc' },
        select: { order: true }
      });
      sectionOrder = (maxOrder?.order ?? -1) + 1;
    }

    const section = await prisma.landingPageSection.create({
      data: {
        landingPageId: params.id,
        type,
        order: sectionOrder,
        title,
        subtitle,
        content,
        backgroundImage,
        backgroundColor,
        videoUrl,
        visible,
        customCss,
        customHtml
      }
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}

// PUT /api/landing-pages/[id]/sections - Update section order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns this landing page
    const landingPage = await prisma.landingPage.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });

    if (!landingPage || landingPage.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { sections } = body; // Array of { id, order }

    // Update all sections in a transaction
    await prisma.$transaction(
      sections.map((section: { id: string; order: number }) =>
        prisma.landingPageSection.update({
          where: { id: section.id },
          data: { order: section.order }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating section order:', error);
    return NextResponse.json(
      { error: 'Failed to update section order' },
      { status: 500 }
    );
  }
}