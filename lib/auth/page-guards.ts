import { redirect } from "next/navigation";
import { getAuthContext, type AuthContext } from "@/lib/auth/session";
import type { Role } from "@/lib/auth/types";

export const DASHBOARD_PATH: Record<Role, string> = {
	customer: "/customer/dashboard",
	staff: "/staff/dashboard",
	manager: "/manager/dashboard",
};

// Use in a Server Component (typically a route group's layout.tsx) to gate
// an entire section by role. Redirects instead of returning a JSON error,
// since this runs for pages rather than API routes.
export async function requirePageRole(roles: Role[]): Promise<AuthContext> {
	const result = await getAuthContext();

	if (!result.ok) {
		redirect("/login");
	}

	if (!roles.includes(result.context.profile.role)) {
		redirect(DASHBOARD_PATH[result.context.profile.role]);
	}

	return result.context;
}

// Use on public-facing pages (/, /login, /register) to bounce an already
// signed-in user straight to their dashboard.
export async function redirectIfAuthenticated() {
	const result = await getAuthContext();
	if (result.ok) {
		redirect(DASHBOARD_PATH[result.context.profile.role]);
	}
}
