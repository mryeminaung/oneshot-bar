import { createClient } from "@/lib/supabase/server";
import type { BarTable } from "@/lib/types/db";

export async function getTables(): Promise<BarTable[]> {
	const supabase = await createClient();
	const { data, error } = await supabase.from("tables").select("*").order("table_number");

	if (error) throw new Error(error.message);
	return data as BarTable[];
}

export interface AvailabilityParams {
	reservationDate: string;
	reservationTime: string;
	guestCount: number;
}

export async function getAvailableTables({
	reservationDate,
	reservationTime,
	guestCount,
}: AvailabilityParams): Promise<BarTable[]> {
	const supabase = await createClient();

	const { data: booked, error: bookedError } = await supabase
		.from("reservations")
		.select("table_id")
		.eq("reservation_date", reservationDate)
		.eq("reservation_time", reservationTime)
		.in("status", ["pending", "confirmed"]);

	if (bookedError) throw new Error(bookedError.message);

	const bookedTableIds = (booked ?? []).map((r) => r.table_id);

	let query = supabase
		.from("tables")
		.select("*")
		.eq("status", "available")
		.gte("capacity", guestCount)
		.order("table_number");

	if (bookedTableIds.length > 0) {
		query = query.not("id", "in", `(${bookedTableIds.join(",")})`);
	}

	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data as BarTable[];
}
