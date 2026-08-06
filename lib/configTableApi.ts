import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export async function requireSuperadmin() {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
    if (sessionUser.role !== "superadmin") {
        return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { error: null };
}
