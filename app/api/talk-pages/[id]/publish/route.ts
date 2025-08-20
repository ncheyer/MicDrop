import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(
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

    const { published } = await request.json();

    // Verify user owns this talk page
    const talkPage = await prisma.talkPage.findFirst({
      where: { 
        id: params.id,
        userId 
      }
    });

    if (!talkPage) {
      return NextResponse.json(
        { error: 'Talk page not found' },
        { status: 404 }
      );
    }

    // Update the publish status
    const updatedPage = await prisma.talkPage.update({
      where: { id: params.id },
      data: { published }
    });

    return NextResponse.json({ 
      success: true,
      published: updatedPage.published 
    });
  } catch (error) {
    console.error('Error updating publish status:', error);
    return NextResponse.json(
      { error: 'Failed to update publish status' },
      { status: 500 }
    );
  }
}