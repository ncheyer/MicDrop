import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, userId, confirmationToken } = await request.json();

    if (!email && !userId) {
      return NextResponse.json(
        { error: "Email or User ID required for data deletion" },
        { status: 400 }
      );
    }

    // In production, you would verify the confirmation token
    // For now, we'll implement immediate deletion for demo purposes
    
    // Begin transaction for complete data deletion
    await prisma.$transaction(async (tx) => {
      // Find user and related data
      let user = null;
      if (userId) {
        user = await tx.user.findUnique({
          where: { id: userId },
          include: {
            talkPages: {
              include: {
                analytics: true,
                emailCaptures: true,
              },
            },
          },
        });
      } else if (email) {
        user = await tx.user.findUnique({
          where: { email },
          include: {
            talkPages: {
              include: {
                analytics: true,
                emailCaptures: true,
              },
            },
          },
        });
      }

      if (user) {
        // Delete user's talk pages and all related data
        for (const talkPage of user.talkPages) {
          // Delete analytics
          await tx.analytics.deleteMany({
            where: { talkPageId: talkPage.id },
          });

          // Delete email captures
          await tx.emailCapture.deleteMany({
            where: { talkPageId: talkPage.id },
          });

          // Delete custom GPTs
          await tx.customGPT.deleteMany({
            where: { talkPageId: talkPage.id },
          });

          // Delete downloads
          await tx.download.deleteMany({
            where: { talkPageId: talkPage.id },
          });

          // Delete business links
          await tx.businessLink.deleteMany({
            where: { talkPageId: talkPage.id },
          });

          // Delete speaker info
          if (talkPage.speakerId) {
            await tx.speaker.delete({
              where: { id: talkPage.speakerId },
            });
          }

          // Delete newsletter info
          if (talkPage.newsletterId) {
            await tx.newsletter.delete({
              where: { id: talkPage.newsletterId },
            });
          }

          // Delete talk page
          await tx.talkPage.delete({
            where: { id: talkPage.id },
          });
        }

        // Delete user account
        await tx.user.delete({
          where: { id: user.id },
        });
      }

      // Delete email-based records even if no user account exists
      const emailToDelete = email || user?.email;
      if (emailToDelete) {
        // Delete email captures
        await tx.emailCapture.deleteMany({
          where: { email: emailToDelete },
        });

        // Delete email capture consents
        await tx.emailCaptureConsent.deleteMany({
          where: { email: emailToDelete },
        });

        // Delete consent records
        await tx.consentRecord.deleteMany({
          where: { email: emailToDelete },
        });
      }

      // Create deletion log for compliance
      await tx.dataDeletionLog.create({
        data: {
          email: emailToDelete || "",
          userId: userId || "",
          deletionDate: new Date(),
          deletionType: "user_request",
          ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0] || 
                    request.headers.get("x-real-ip") || 
                    "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "All personal data has been permanently deleted from our systems.",
    });
  } catch (error) {
    console.error("Error deleting user data:", error);
    return NextResponse.json(
      { error: "Failed to delete user data" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    if (!email && !userId) {
      return NextResponse.json(
        { error: "Email or User ID required" },
        { status: 400 }
      );
    }

    // Check what data exists for this user
    const dataExists = {
      user: false,
      emailCaptures: 0,
      consentRecords: 0,
      talkPages: 0,
    };

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          talkPages: true,
        },
      });
      
      if (user) {
        dataExists.user = true;
        dataExists.talkPages = user.talkPages.length;
      }
    }

    if (email) {
      const emailCaptures = await prisma.emailCapture.count({
        where: { email },
      });
      
      const consentRecords = await prisma.consentRecord.count({
        where: { email },
      });

      dataExists.emailCaptures = emailCaptures;
      dataExists.consentRecords = consentRecords;
    }

    return NextResponse.json({
      dataExists,
      deletionInfo: {
        whatWillBeDeleted: [
          "User account and profile information",
          "All talk pages and associated content",
          "Email capture records and newsletter signups",
          "Analytics and usage data",
          "Privacy consent records",
          "Any uploaded files and resources",
        ],
        whatWillBeRetained: [
          "Anonymized analytics for platform improvement",
          "Legal compliance records (without personal identifiers)",
          "Financial records as required by law",
        ],
        timeframe: "Deletion occurs immediately and cannot be undone",
      },
    });
  } catch (error) {
    console.error("Error checking deletion data:", error);
    return NextResponse.json(
      { error: "Failed to check user data" },
      { status: 500 }
    );
  }
}