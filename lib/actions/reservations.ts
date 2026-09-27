"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthContext } from "@/lib/auth/session";
import {
	createReservationSchema,
	updateReservationStatusSchema,
} from "@/lib/validations/reservation.schema";
import type { ActionState } from "@/lib/actions/types";

export async function createReservationAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
	const result = await getAuthContext();
	if (!result.ok) {
		return { error: "You must be signed in to make a reservation." };
	}

	const parsed = createReservationSchema.safeParse({
		table_id: formData.get("table_id"),
		reservation_date: formData.get("reservation_date"),
		reservation_time: formData.get("reservation_time"),
		guest_count: formData.get("guest_count"),
	});

	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
	}

	const supabase = await createClient();
	const { error } = await supabase.from("reservations").insert({
		...parsed.data,
		user_id: result.context.user.id,
	});

	if (error) {
		if (error.code === "23505") {
			return { error: "That table was just booked for this time slot. Please pick another." };
		}
		return { error: error.message };
	}

	revalidatePath("/customer/reservations");
	redirect("/customer/reservations");
}

export async function cancelReservationAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
	const result = await getAuthContext();
	if (!result.ok) {
		return { error: "You must be signed in." };
	}

	const id = formData.get("id");
	if (typeof id !== "string" || !id) {
		return { error: "Missing reservation id." };
	}

	const supabase = await createClient();
	const { data, error } = await supabase
		.from("reservations")
		.update({ status: "cancelled" })
		.eq("id", id)
		.in("status", ["pending", "confirmed"])
		.select("id");

	if (error) {
		return { error: error.message };
	}

	if (!data || data.length === 0) {
		return { error: "This reservation can no longer be cancelled." };
	}

	revalidatePath("/customer/reservations");
	revalidatePath("/staff/reservations");
	revalidatePath("/manager/reservations");
	return { success: true };
}

export async function updateReservationStatusAction(
	_prevState: ActionState,
	formData: FormData
): Promise<ActionState> {
	const result = await getAuthContext();
	if (!result.ok || !["staff", "manager"].includes(result.context.profile.role)) {
		return { error: "Only staff or managers can update reservation status." };
	}

	const parsed = updateReservationStatusSchema.safeParse({
		id: formData.get("id"),
		status: formData.get("status"),
	});

	if (!parsed.success) {
		return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
	}

	const supabase = await createClient();
	const { error } = await supabase
		.from("reservations")
		.update({ status: parsed.data.status })
		.eq("id", parsed.data.id);

	if (error) {
		return { error: error.message };
	}

	revalidatePath("/staff/reservations");
	revalidatePath("/manager/reservations");
	revalidatePath("/staff/dashboard");
	revalidatePath("/manager/dashboard");
	return { success: true };
}
