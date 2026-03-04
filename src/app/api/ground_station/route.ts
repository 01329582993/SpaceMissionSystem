import { NextResponse } from 'next/server';

export async function GET() {
    // This is the data that the map will "read"
    const stations = [
        { station_id: 1, name: "CANBERRA_DSN", status: "Active" },
        { station_id: 2, name: "MADRID_DSN", status: "Active" },
        { station_id: 3, name: "GOLDSTONE_DSN", status: "Maintenance" },
        { station_id: 4, name: "SECTOR_7_CORE", status: "Active" }
    ];

    return NextResponse.json(stations);
}