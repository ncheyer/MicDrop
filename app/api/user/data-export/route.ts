import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!userId && !email) {
      return NextResponse.json(
        { error: "User ID or email required for data export" },
        { status: 400 }
      );
    }

    // Collect all user data across the platform
    const userData: any = {
      exportDate: new Date().toISOString(),
      requestedBy: { userId, email },
      data: {},
    };

    // User account data
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          talkPages: {
            include: {
              customGpts: true,
              downloads: true,
              businessLinks: true,
              analytics: true,
              emailCaptures: true,
            },
          },
        },
      });

      if (user) {
        userData.data.account = {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          talkPages: user.talkPages.map(page => ({
            id: page.id,
            title: page.title,
            slug: page.slug,
            published: page.published,
            createdAt: page.createdAt,
            analytics: page.analytics,
            emailCaptures: page.emailCaptures.map(capture => ({
              email: capture.email,
              name: capture.name,
              tier: capture.tier,
              createdAt: capture.createdAt,
            })),
          })),
        };
      }
    }

    // Email captures across all talk pages
    const emailCaptures = await prisma.emailCapture.findMany({
      where: {
        email: email || undefined,
      },
      include: {
        talkPage: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    if (emailCaptures.length > 0) {
      userData.data.emailCaptures = emailCaptures.map(capture => ({
        email: capture.email,
        name: capture.name,
        tier: capture.tier,
        talkPage: capture.talkPage,
        createdAt: capture.createdAt,
      }));
    }

    // Email capture consents
    const emailCaptureConsents = await prisma.emailCaptureConsent.findMany({
      where: {
        email: email || undefined,
      },
    });

    if (emailCaptureConsents.length > 0) {
      userData.data.emailCaptureConsents = emailCaptureConsents.map(consent => ({
        email: consent.email,
        name: consent.name,
        marketingConsent: consent.marketingConsent,
        analyticsConsent: consent.analyticsConsent,
        source: consent.source,
        timestamp: consent.timestamp,
      }));
    }

    // Consent records
    const consentRecords = await prisma.consentRecord.findMany({
      where: {
        OR: [
          { userId: userId || undefined },
          { email: email || undefined },
        ],
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    if (consentRecords.length > 0) {
      userData.data.consentRecords = consentRecords.map(record => ({
        preferences: record.preferences,
        timestamp: record.timestamp,
        version: record.version,
        source: record.source,
      }));
    }

    // Analytics data (anonymized)
    if (userId) {
      const analytics = await prisma.analytics.findMany({
        where: {
          talkPage: {
            userId: userId,
          },
        },
      });

      if (analytics.length > 0) {
        userData.data.analytics = analytics.map(record => ({
          event: record.event,
          timestamp: record.createdAt,
          // Note: We don't include IP addresses or other identifying data
        }));
      }
    }

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(userData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="micdrop-data-export-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting user data:", error);
    return NextResponse.json(
      { error: "Failed to export user data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, userId } = await request.json();
    
    // Queue data export request (for large datasets)
    // In a production environment, this would trigger a background job
    
    // For now, redirect to GET endpoint
    const exportUrl = new URL("/api/user/data-export", request.url);
    if (userId) exportUrl.searchParams.set("userId", userId);
    if (email) exportUrl.searchParams.set("email", email);
    
    return NextResponse.json({
      message: "Data export queued",
      downloadUrl: exportUrl.toString(),
    });
  } catch (error) {
    console.error("Error queuing data export:", error);
    return NextResponse.json(
      { error: "Failed to queue data export" },
      { status: 500 }
    );
  }
}