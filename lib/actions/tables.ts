"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/lib/auth/session";
import { createTableSchema, updateTableSchema } from "@/lib/validations/table.schema";
import type { ActionState } from "@/lib/actions/types";

async function requireManager() {
	const result = await getAuthContext();
	if (!result.ok || result.context.profile.role !== "manager") {
		throw new Error("Only managers can manage tables.");
	}
	return result.context;
}

export async function createTableAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
	await requireManager();

	const parsed = createTableSchema.safeParse({
		table_number: formData.get("table_number"),
		capacity: formData.get("capacity"),
		status: formData.get("status") || undefined,
	});

	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
	}

	const supabase = await createClient();
	const { error } = await supabase.from("tables").insert(parsed.data);

	if (error) {
		if (error.code === "23505") {
			return { error: "A table with this number already exists." };
		}
		return { error: error.message };
	}

	revalidatePath("/manager/tables");
	return { success: true };
}

export async function updateTableAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
	await requireManager();

	const parsed = updateTableSchema.safeParse({
		id: formData.get("id"),
		table_number: formData.get("table_number"),
		capacity: formData.get("capacity"),
		status: formData.get("status") || undefined,
	});

	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
	}

	const { id, ...fields } = parsed.data;
	const supabase = await createClient();
	const { error } = await supabase.from("tables").update(fields).eq("id", id);

	if (error) {
		if (error.code === "23505") {
			return { error: "A table with this number already exists." };
		}
		return { error: error.message };
	}

	revalidatePath("/manager/tables");
	return { success: true };
}

export async function deleteTableAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
	await requireManager();

	const id = formData.get("id");
	if (typeof id !== "string" || !id) {
		return { error: "Missing table id." };
	}

	const supabase = await createClient();
	const { error } = await supabase.from("tables").delete().eq("id", id);

	if (error) {
		if (error.code === "23503") {
			return { error: "This table has reservations and can't be deleted." };
		}
		return { error: error.message };
	}

	revalidatePath("/manager/tables");
	return { success: true };
}
