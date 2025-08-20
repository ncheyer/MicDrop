import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const emailData = await request.json();
    
    // Get IP address from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwarded?.split(",")[0] || realIp || "unknown";

    // Store email capture with consent preferences
    await prisma.emailCaptureConsent.create({
      data: {
        email: emailData.email,
        name: emailData.name || null,
        marketingConsent: emailData.marketingConsent,
        analyticsConsent: emailData.analyticsConsent,
        source: emailData.source,
        ipAddress,
        timestamp: new Date(emailData.timestamp),
      },
    });

    // If this is linked to a talk page, also update the regular email capture
    if (emailData.talkPageId) {
      await prisma.emailCapture.create({
        data: {
          talkPageId: emailData.talkPageId,
          email: emailData.email,
          name: emailData.name || "",
          tier: emailData.tier || "newsletter",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error storing email capture with consent:", error);
    return NextResponse.json(
      { error: "Failed to store email capture" },
      { status: 500 }
    );
  }
}