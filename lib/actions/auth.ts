"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";
import { DASHBOARD_PATH } from "@/lib/auth/page-guards";

export interface AuthFormState {
	error?: string;
	message?: string;
}

export async function loginAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
	const parsed = loginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
	}

	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

	if (error || !data.user) {
		return { error: error?.message ?? "Invalid email or password." };
	}

	const admin = createAdminClient();
	const { data: profile, error: profileError } = await admin
		.from("profiles")
		.select("role")
		.eq("id", data.user.id)
		.single();

	if (profileError || !profile) {
		return { error: profileError?.message ?? "Signed in, but couldn't load your account profile. Please try again." };
	}

	redirect(DASHBOARD_PATH[profile.role as keyof typeof DASHBOARD_PATH]);
}

export async function registerAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
	const parsed = registerSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
	}

	const supabase = await createClient();

	const { data, error } = await supabase.auth.signUp({
		email: parsed.data.email,
		password: parsed.data.password,
		options: { data: { full_name: parsed.data.name } },
	});

	if (error) {
		if (error.code === "user_already_exists" || error.status === 422) {
			return { error: "An account with this email already exists." };
		}
		return { error: error.message };
	}

	if (data.user && data.user.identities && data.user.identities.length === 0) {
		return { error: "An account with this email already exists." };
	}

	if (!data.session) {
		return { message: "Registration successful. Check your email to confirm your account, then log in." };
	}

	redirect(DASHBOARD_PATH.customer);
}

export async function logoutAction() {
	const supabase = await createClient();
	await supabase.auth.signOut();
	redirect("/login");
}
