// src/app/api/celestial/sync/route.ts
import { NextResponse } from "next/server";
import { syncCelestialEvents } from "@/src/lib/celestialService";

export async function POST() {
    try {
        await syncCelestialEvents();
        return NextResponse.json({ success: true, message: "Celestial events synchronized." });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: "Use POST to trigger sync." });
}
