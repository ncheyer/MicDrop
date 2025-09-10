import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

// GET /api/landing-pages/[id] - Get a specific landing page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const landingPage = await prisma.landingPage.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        },
        customGpts: {
          orderBy: { order: 'asc' }
        },
        talkPage: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.landingPage.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error('Error fetching landing page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch landing page' },
      { status: 500 }
    );
  }
}

// PUT /api/landing-pages/[id] - Update a landing page
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
    const existingPage = await prisma.landingPage.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });

    if (!existingPage || existingPage.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      type,
      published,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
      talkPageId
    } = body;

    // If slug is being changed, check if new slug is available
    if (slug) {
      const slugExists = await prisma.landingPage.findFirst({
        where: {
          slug,
          id: { not: params.id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    const updatedPage = await prisma.landingPage.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        description,
        type,
        published,
        metaTitle,
        metaDescription,
        metaKeywords,
        ogImage,
        talkPageId
      },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        },
        customGpts: {
          orderBy: { order: 'asc' }
        },
        talkPage: true
      }
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating landing page:', error);
    return NextResponse.json(
      { error: 'Failed to update landing page' },
      { status: 500 }
    );
  }
}

// DELETE /api/landing-pages/[id] - Delete a landing page
export async function DELETE(
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
    const existingPage = await prisma.landingPage.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });

    if (!existingPage || existingPage.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.landingPage.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting landing page:', error);
    return NextResponse.json(
      { error: 'Failed to delete landing page' },
      { status: 500 }
    );
  }
}