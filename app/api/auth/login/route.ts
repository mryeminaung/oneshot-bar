import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/validations/auth.schema";

export async function POST(req: Request) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "invalid_body", message: "Request body must be JSON." }, { status: 400 });
	}

	let input;
	try {
		input = loginSchema.parse(body);
	} catch (err) {
		if (err instanceof ZodError) {
			return NextResponse.json(
				{ error: "validation_error", message: "Invalid input.", issues: err.flatten() },
				{ status: 400 }
			);
		}
		throw err;
	}

	const supabase = await createClient();

	const { data, error } = await supabase.auth.signInWithPassword({
		email: input.email,
		password: input.password,
	});

	if (error || !data.user) {
		return NextResponse.json(
			{ error: "invalid_credentials", message: "Invalid email or password." },
			{ status: 401 }
		);
	}

	const { data: profile, error: profileError } = await supabase
		.from("profiles")
		.select("id, full_name, email, role")
		.eq("id", data.user.id)
		.single();

	if (profileError || !profile) {
		return NextResponse.json(
			{ error: "profile_not_found", message: "No profile found for this account." },
			{ status: 500 }
		);
	}

	// signInWithPassword already set the session via HTTP-only cookies
	// through the @supabase/ssr server client.
	return NextResponse.json({ message: "Login successful.", user: profile });
}
