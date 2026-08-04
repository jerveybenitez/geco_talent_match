import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboardData";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get("userid");

    if (!userid) {
        return NextResponse.json({ error: "userid is required" }, { status: 400 });
    }

    const data = await getDashboardData(userid);

    if (!data) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}
