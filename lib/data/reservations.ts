import { createClient } from "@/lib/supabase/server";
import type { ReservationStatus, ReservationWithDetails } from "@/lib/types/db";

const RESERVATION_WITH_DETAILS_SELECT =
	"*, table:tables(table_number, capacity), customer:profiles(full_name, email)";

function today(): string {
	return new Date().toISOString().slice(0, 10);
}

export async function getMyReservations(userId: string): Promise<ReservationWithDetails[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("reservations")
		.select(RESERVATION_WITH_DETAILS_SELECT)
		.eq("user_id", userId)
		.order("reservation_date", { ascending: false })
		.order("reservation_time", { ascending: false });

	if (error) throw new Error(error.message);
	return data as unknown as ReservationWithDetails[];
}

export async function getTodayReservations(): Promise<ReservationWithDetails[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("reservations")
		.select(RESERVATION_WITH_DETAILS_SELECT)
		.eq("reservation_date", today())
		.order("reservation_time");

	if (error) throw new Error(error.message);
	return data as unknown as ReservationWithDetails[];
}

export interface ReservationFilters {
	date?: string;
	status?: ReservationStatus;
}

export async function getAllReservations(filters: ReservationFilters = {}): Promise<ReservationWithDetails[]> {
	const supabase = await createClient();
	let query = supabase
		.from("reservations")
		.select(RESERVATION_WITH_DETAILS_SELECT)
		.order("reservation_date", { ascending: false })
		.order("reservation_time", { ascending: false });

	if (filters.date) query = query.eq("reservation_date", filters.date);
	if (filters.status) query = query.eq("status", filters.status);

	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data as unknown as ReservationWithDetails[];
}

export interface DashboardStats {
	todayReservationsCount: number;
	availableTablesCount: number;
	reservedTablesCount: number;
	totalCustomersCount: number;
	recentReservations: ReservationWithDetails[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
	const supabase = await createClient();
	const todayStr = today();

	const [
		{ count: todayReservationsCount },
		{ count: availableTablesCount },
		{ data: reservedTables },
		{ count: totalCustomersCount },
		{ data: recentReservations, error: recentError },
	] = await Promise.all([
		supabase
			.from("reservations")
			.select("*", { count: "exact", head: true })
			.eq("reservation_date", todayStr),
		supabase.from("tables").select("*", { count: "exact", head: true }).eq("status", "available"),
		supabase
			.from("reservations")
			.select("table_id")
			.eq("reservation_date", todayStr)
			.in("status", ["pending", "confirmed"]),
		supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
		supabase
			.from("reservations")
			.select(RESERVATION_WITH_DETAILS_SELECT)
			.order("created_at", { ascending: false })
			.limit(15),
	]);

	if (recentError) throw new Error(recentError.message);

	const reservedTablesCount = new Set((reservedTables ?? []).map((r) => r.table_id)).size;

	return {
		todayReservationsCount: todayReservationsCount ?? 0,
		availableTablesCount: availableTablesCount ?? 0,
		reservedTablesCount,
		totalCustomersCount: totalCustomersCount ?? 0,
		recentReservations: recentReservations as unknown as ReservationWithDetails[],
	};
}
