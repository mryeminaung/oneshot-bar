export type TableStatus = "available" | "unavailable";
export type ReservationStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface BarTable {
	id: string;
	table_number: number;
	capacity: number;
	status: TableStatus;
	created_at: string;
}

export interface ReservationRow {
	id: string;
	user_id: string;
	table_id: string;
	reservation_date: string;
	reservation_time: string;
	guest_count: number;
	status: ReservationStatus;
	created_at: string;
}

export interface ReservationWithDetails extends ReservationRow {
	table: Pick<BarTable, "table_number" | "capacity"> | null;
	customer: { full_name: string; email: string } | null;
}

export function formatTableNumber(n: number): string {
	return `Table ${String(n).padStart(2, "0")}`;
}
