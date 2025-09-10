import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/db";
import LandingPageRenderer from "@/components/LandingPageRenderer";

interface Props {
  params: { slug: string };
}

async function getLandingPage(slug: string) {
  try {
    const landingPage = await prisma.landingPage.findUnique({
      where: { 
        slug,
        published: true 
      },
      include: {
        sections: {
          where: { visible: true },
          orderBy: { order: 'asc' }
        },
        talkPage: {
          include: {
            customGpts: true,
            downloads: true,
            businessLinks: true
          }
        },
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!landingPage) {
      return null;
    }

    // Increment view count
    await prisma.landingPage.update({
      where: { id: landingPage.id },
      data: { viewCount: { increment: 1 } }
    });

    return landingPage;
  } catch (error) {
    console.error("Error fetching landing page:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const landingPage = await getLandingPage(params.slug);
  
  if (!landingPage) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.'
    };
  }

  return {
    title: landingPage.metaTitle || landingPage.title,
    description: landingPage.metaDescription || landingPage.description || '',
    keywords: landingPage.metaKeywords || undefined,
    openGraph: {
      title: landingPage.metaTitle || landingPage.title,
      description: landingPage.metaDescription || landingPage.description || '',
      images: landingPage.ogImage ? [landingPage.ogImage] : undefined,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: landingPage.metaTitle || landingPage.title,
      description: landingPage.metaDescription || landingPage.description || '',
      images: landingPage.ogImage ? [landingPage.ogImage] : undefined
    }
  };
}

export default async function LandingPage({ params }: Props) {
  const landingPage = await getLandingPage(params.slug);

  if (!landingPage) {
    notFound();
  }

  return <LandingPageRenderer data={landingPage} />;
}