import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { doNotSell } = await request.json();
    
    // Get IP address from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwarded?.split(",")[0] || realIp || "unknown";

    // Store CCPA do-not-sell preference
    await prisma.ccpaOptOut.create({
      data: {
        ipAddress,
        doNotSell,
        timestamp: new Date(),
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error storing CCPA opt-out:", error);
    return NextResponse.json(
      { error: "Failed to store CCPA preference" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get IP address from headers
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ipAddress = forwarded?.split(",")[0] || realIp || "unknown";

    // Get latest CCPA preference for this IP
    const ccpaRecord = await prisma.ccpaOptOut.findFirst({
      where: {
        ipAddress,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return NextResponse.json({
      doNotSell: ccpaRecord?.doNotSell || false,
    });
  } catch (error) {
    console.error("Error retrieving CCPA preference:", error);
    return NextResponse.json(
      { error: "Failed to retrieve CCPA preference" },
      { status: 500 }
    );
  }
}