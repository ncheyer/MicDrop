import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import TalkPageClient from "./client-page";

async function getTalkPage(slug: string) {
  try {
    const talkPage = await prisma.talkPage.findUnique({
      where: { slug },
      include: {
        customGpts: {
          orderBy: { order: 'asc' }
        },
        downloads: {
          orderBy: { order: 'asc' }
        },
        businessLinks: {
          orderBy: { order: 'asc' }
        },
      }
    });

    return talkPage;
  } catch (error) {
    console.error("Error fetching talk page:", error);
    return null;
  }
}

export default async function TalkPage({ params }: { params: { slug: string } }) {
  const cookieStore = cookies();
  const userId = cookieStore.get('userId')?.value;
  const talkPage = await getTalkPage(params.slug);

  if (!talkPage) {
    notFound();
  }

  // Check if the current user is the owner of this page
  const isOwner = !!(userId && talkPage.userId === userId);

  // Transform data to match client expectations
  const pageData = {
    id: talkPage.id,
    slug: talkPage.slug,
    title: talkPage.title,
    date: talkPage.date,
    hook: talkPage.hook || undefined,
    speaker: {
      name: talkPage.speakerName,
      email: talkPage.speakerEmail,
      photo: talkPage.speakerPhoto || undefined,
      bio: talkPage.speakerBio || undefined,
      linkedinUrl: talkPage.speakerLinkedIn || undefined,
    },
    customGpts: talkPage.customGpts.map(gpt => ({
      name: gpt.name,
      description: gpt.description,
      url: gpt.url,
    })),
    downloads: talkPage.downloads.map(download => ({
      title: download.title,
      description: download.description || undefined,
      fileUrl: download.fileUrl,
      requiresEmail: download.requiresEmail,
    })),
    businessLinks: talkPage.businessLinks.map(link => ({
      name: link.name,
      description: link.description,
      url: link.url,
      ctaText: link.ctaText,
    })),
    keynoteNotesUrl: talkPage.keynoteNotesUrl || undefined,
    keynoteSlidesUrl: talkPage.keynoteSlidesUrl || undefined,
    newsletter: talkPage.newsletterEnabled ? {
      enabled: true,
      description: talkPage.newsletterDescription || "",
      signupUrl: talkPage.newsletterSignupUrl || "",
    } : undefined,
    newsletterBannerUrl: talkPage.newsletterBannerUrl || undefined,
    contactEmail: talkPage.contactEmail || undefined,
    calendarLink: talkPage.calendarLink || undefined,
    isOwner,
  };

  return <TalkPageClient initialData={pageData} />;
}