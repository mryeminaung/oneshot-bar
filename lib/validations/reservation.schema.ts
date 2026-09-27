import { z } from "zod";

export const reservationStatusValues = ["pending", "confirmed", "completed", "cancelled"] as const;

function isTodayOrLater(dateStr: string) {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const date = new Date(`${dateStr}T00:00:00`);
	return date >= today;
}

export const createReservationSchema = z.object({
	table_id: z.string().uuid(),
	reservation_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
		.refine(isTodayOrLater, "Reservation date cannot be in the past"),
	reservation_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time"),
	guest_count: z.coerce.number().int().positive("Guest count must be positive"),
});

export const availabilitySearchSchema = z.object({
	reservation_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
		.refine(isTodayOrLater, "Date cannot be in the past"),
	reservation_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time"),
	guest_count: z.coerce.number().int().positive("Guest count must be positive"),
});

export const updateReservationStatusSchema = z.object({
	id: z.string().uuid(),
	status: z.enum(reservationStatusValues),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type AvailabilitySearchInput = z.infer<typeof availabilitySearchSchema>;
export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>;
