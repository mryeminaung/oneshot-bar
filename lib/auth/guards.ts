import { NextResponse } from "next/server";
import { getAuthContext, type AuthContext } from "@/lib/auth/session";
import type { Role } from "@/lib/auth/types";

const STATUS_MESSAGES: Record<string, string> = {
	missing_authentication: "You must be signed in to access this resource.",
	invalid_or_expired_session: "Your session is invalid or has expired. Please sign in again.",
	forbidden: "You do not have permission to access this resource.",
};

function authErrorResponse(error: string, status: number) {
	return NextResponse.json({ error, message: STATUS_MESSAGES[error] }, { status });
}

// Wraps a route handler so it only runs for an authenticated caller.
export function withAuth(
	handler: (context: AuthContext, req: Request) => Promise<Response>
) {
	return async (req: Request) => {
		const result = await getAuthContext();
		if (!result.ok) {
			return authErrorResponse(result.error, result.status);
		}
		return handler(result.context, req);
	};
}

// Wraps a route handler so it only runs for an authenticated caller whose
// role is in `roles` — e.g. requireRole(["manager"]) or requireRole(["manager", "staff"]).
export function requireRole(
	roles: Role[],
	handler: (context: AuthContext, req: Request) => Promise<Response>
) {
	return withAuth(async (context, req) => {
		if (!roles.includes(context.profile.role)) {
			return authErrorResponse("forbidden", 403);
		}
		return handler(context, req);
	});
}
