import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

// GET /api/landing-pages/[id]/gpts - Get all GPTs for a landing page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gpts = await prisma.landingPageGPT.findMany({
      where: { landingPageId: params.id },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(gpts);
  } catch (error) {
    console.error('Error fetching GPTs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GPTs' },
      { status: 500 }
    );
  }
}

// POST /api/landing-pages/[id]/gpts - Add a new GPT to a landing page
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
    const { name, description, url, order = 0 } = body;

    if (!name || !description || !url) {
      return NextResponse.json(
        { error: 'Name, description, and URL are required' },
        { status: 400 }
      );
    }

    const gpt = await prisma.landingPageGPT.create({
      data: {
        name,
        description,
        url,
        order,
        landingPageId: params.id
      }
    });

    return NextResponse.json(gpt);
  } catch (error) {
    console.error('Error creating GPT:', error);
    return NextResponse.json(
      { error: 'Failed to create GPT' },
      { status: 500 }
    );
  }
}

// PUT /api/landing-pages/[id]/gpts - Update GPTs for a landing page
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
    const { gpts } = body;

    if (!Array.isArray(gpts)) {
      return NextResponse.json(
        { error: 'GPTs must be an array' },
        { status: 400 }
      );
    }

    // Delete existing GPTs
    await prisma.landingPageGPT.deleteMany({
      where: { landingPageId: params.id }
    });

    // Create new GPTs
    const createdGpts = await Promise.all(
      gpts.map((gpt, index) =>
        prisma.landingPageGPT.create({
          data: {
            name: gpt.name,
            description: gpt.description,
            url: gpt.url,
            order: gpt.order ?? index,
            landingPageId: params.id
          }
        })
      )
    );

    return NextResponse.json(createdGpts);
  } catch (error) {
    console.error('Error updating GPTs:', error);
    return NextResponse.json(
      { error: 'Failed to update GPTs' },
      { status: 500 }
    );
  }
}

// DELETE /api/landing-pages/[id]/gpts/[gptId] - Delete a specific GPT
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; gptId?: string } }
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

    const url = new URL(request.url);
    const gptId = url.pathname.split('/').pop();

    if (gptId && gptId !== 'gpts') {
      // Delete specific GPT
      await prisma.landingPageGPT.delete({
        where: { id: gptId }
      });
    } else {
      // Delete all GPTs for this landing page
      await prisma.landingPageGPT.deleteMany({
        where: { landingPageId: params.id }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting GPT:', error);
    return NextResponse.json(
      { error: 'Failed to delete GPT' },
      { status: 500 }
    );
  }
}