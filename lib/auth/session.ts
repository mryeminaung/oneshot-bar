import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Profile } from "@/lib/auth/types";

export interface AuthContext {
	user: { id: string; email: string };
	profile: Profile;
}

export type AuthResult =
	| { ok: true; context: AuthContext }
	| { ok: false; status: 401; error: "missing_authentication" | "invalid_or_expired_session" };

// Verifies the Supabase session cookie and loads the caller's profile
// (name/role). Use this at the top of any route handler that requires auth.
export async function getAuthContext(): Promise<AuthResult> {
	const supabase = await createClient();

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		return {
			ok: false,
			status: 401,
			error: userError ? "invalid_or_expired_session" : "missing_authentication",
		};
	}

	const admin = createAdminClient();
	const { data: profile, error: profileError } = await admin
		.from("profiles")
		.select("id, full_name, email, role, created_at, updated_at")
		.eq("id", user.id)
		.single();

	if (profileError || !profile) {
		return { ok: false, status: 401, error: "invalid_or_expired_session" };
	}

	return {
		ok: true,
		context: {
			user: { id: user.id, email: user.email! },
			profile: profile as Profile,
		},
	};
}
