"use client";

import { useActionState } from "react";
import { createReservationAction } from "@/lib/actions/reservations";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/actions/types";

const initialState: ActionState = {};

export function ReserveForm({
	tableId,
	reservationDate,
	reservationTime,
	guestCount,
}: {
	tableId: string;
	reservationDate: string;
	reservationTime: string;
	guestCount: number;
}) {
	const [state, formAction] = useActionState(createReservationAction, initialState);

	return (
		<form action={formAction} className="flex flex-col items-stretch gap-1">
			<input type="hidden" name="table_id" value={tableId} />
			<input type="hidden" name="reservation_date" value={reservationDate} />
			<input type="hidden" name="reservation_time" value={reservationTime} />
			<input type="hidden" name="guest_count" value={guestCount} />
			<SubmitButton className="w-full" pendingText="Reserving...">
				Reserve
			</SubmitButton>
			{state.error && <p className="text-xs text-destructive">{state.error}</p>}
		</form>
	);
}
