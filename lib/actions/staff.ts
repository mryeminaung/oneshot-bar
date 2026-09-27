"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthContext } from "@/lib/auth/session";
import { createStaffSchema } from "@/lib/validations/staff.schema";
import type { ActionState } from "@/lib/actions/types";

async function requireManager() {
	const result = await getAuthContext();
	if (!result.ok || result.context.profile.role !== "manager") {
		throw new Error("Only managers can manage staff.");
	}
}

export async function createStaffAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
	await requireManager();

	const parsed = createStaffSchema.safeParse({
		name: formData.get("name"),
		email: formData.get("email"),
		password: formData.get("password"),
	});

	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
	}

	const admin = createAdminClient();
	const { error } = await admin.auth.admin.createUser({
		email: parsed.data.email,
		password: parsed.data.password,
		email_confirm: true,
		user_metadata: { full_name: parsed.data.name, role: "staff" },
	});

	if (error) {
		if (error.code === "email_exists") {
			return { error: "An account with this email already exists." };
		}
		return { error: error.message };
	}

	revalidatePath("/manager/staff");
	return { success: true };
}

export async function deleteStaffAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
	await requireManager();

	const id = formData.get("id");
	if (typeof id !== "string" || !id) {
		return { error: "Missing staff id." };
	}

	const supabase = await createClient();
	const { data: target, error: lookupError } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", id)
		.single();

	if (lookupError || !target || target.role !== "staff") {
		return { error: "That account is not a staff member." };
	}

	const admin = createAdminClient();
	const { error } = await admin.auth.admin.deleteUser(id);

	if (error) {
		return { error: error.message };
	}

	revalidatePath("/manager/staff");
	return { success: true };
}
