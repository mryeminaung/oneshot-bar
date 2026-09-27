import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";
import { registerSchema } from "@/lib/validations/auth.schema";

export async function POST(req: Request) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json({ error: "invalid_body", message: "Request body must be JSON." }, { status: 400 });
	}

	let input;
	try {
		input = registerSchema.parse(body);
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

	const { data, error } = await supabase.auth.signUp({
		email: input.email,
		password: input.password,
		options: { data: { full_name: input.name } },
	});

	if (error) {
		if (error.code === "user_already_exists" || error.status === 422) {
			return NextResponse.json(
				{ error: "duplicate_email", message: "An account with this email already exists." },
				{ status: 409 }
			);
		}
		return NextResponse.json({ error: "registration_failed", message: error.message }, { status: 400 });
	}

	// With "Confirm email" enabled, re-signing up an existing address returns
	// a user object with no identities instead of an error.
	if (data.user && data.user.identities && data.user.identities.length === 0) {
		return NextResponse.json(
			{ error: "duplicate_email", message: "An account with this email already exists." },
			{ status: 409 }
		);
	}

	return NextResponse.json(
		{
			message: data.session
				? "Registration successful."
				: "Registration successful. Check your email to confirm your account.",
			user: data.user && { id: data.user.id, email: data.user.email, full_name: input.name, role: "customer" },
		},
		{ status: 201 }
	);
}
