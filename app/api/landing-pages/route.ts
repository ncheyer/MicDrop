import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

// GET /api/landing-pages - Get all landing pages for the current user
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const published = searchParams.get('published');

    const where: any = { userId };
    
    if (type) {
      where.type = type;
    }
    
    if (published !== null) {
      where.published = published === 'true';
    }

    const landingPages = await prisma.landingPage.findMany({
      where,
      include: {
        sections: {
          orderBy: { order: 'asc' }
        },
        talkPage: {
          select: {
            id: true,
            title: true,
            speakerName: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json(landingPages);
  } catch (error) {
    console.error('Error fetching landing pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch landing pages' },
      { status: 500 }
    );
  }
}

// POST /api/landing-pages - Create a new landing page
export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      title, 
      slug, 
      type = 'general', 
      description,
      metaTitle,
      metaDescription,
      metaKeywords,
      talkPageId,
      templateId,
      customGpts = [],
      sections: incomingSections
    } = body;

    // Check if slug is already taken
    const existingPage = await prisma.landingPage.findUnique({
      where: { slug }
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // If a template is specified, fetch it
    let sections = incomingSections || [];
    if (templateId && !incomingSections) {
      const template = await prisma.landingPageTemplate.findUnique({
        where: { id: templateId }
      });
      
      if (template && template.sections) {
        sections = template.sections as any[];
        
        // Increment template usage count
        await prisma.landingPageTemplate.update({
          where: { id: templateId },
          data: { usageCount: { increment: 1 } }
        });
      }
    }

    // Create the landing page
    const landingPage = await prisma.landingPage.create({
      data: {
        title,
        slug,
        type,
        description,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || description,
        metaKeywords,
        userId,
        talkPageId,
        sections: {
          create: sections.map((section: any, index: number) => ({
            type: section.type,
            order: section.order ?? index,
            title: section.title,
            subtitle: section.subtitle,
            content: section.content,
            backgroundImage: section.backgroundImage,
            backgroundColor: section.backgroundColor,
            visible: section.visible ?? true
          }))
        },
        customGpts: {
          create: customGpts.map((gpt: any, index: number) => ({
            name: gpt.name,
            description: gpt.description,
            url: gpt.url,
            order: gpt.order ?? index
          }))
        }
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

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error('Error creating landing page:', error);
    return NextResponse.json(
      { error: 'Failed to create landing page' },
      { status: 500 }
    );
  }
}