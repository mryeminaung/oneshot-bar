import { NextResponse } from "next/server";
import { withAuth } from "@/lib/auth/guards";

export const GET = withAuth(async ({ profile }) => {
	return NextResponse.json({ user: profile });
});
