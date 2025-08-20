import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const consentData = await request.json();
    
    // Get IP address from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwarded?.split(",")[0] || realIp || "unknown";

    // Store consent record for compliance
    await prisma.consentRecord.create({
      data: {
        userId: consentData.userId || null,
        email: consentData.email || null,
        ipAddress,
        userAgent: consentData.userAgent || "unknown",
        preferences: consentData.preferences,
        timestamp: new Date(consentData.timestamp),
        version: consentData.version,
        source: consentData.source,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error storing consent record:", error);
    return NextResponse.json(
      { error: "Failed to store consent" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!userId && !email) {
      return NextResponse.json(
        { error: "User ID or email required" },
        { status: 400 }
      );
    }

    // Get latest consent record
    const consentRecord = await prisma.consentRecord.findFirst({
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

    return NextResponse.json(consentRecord);
  } catch (error) {
    console.error("Error retrieving consent record:", error);
    return NextResponse.json(
      { error: "Failed to retrieve consent" },
      { status: 500 }
    );
  }
}