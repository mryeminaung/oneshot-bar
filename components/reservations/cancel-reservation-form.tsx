"use client";

import { useActionState } from "react";
import { cancelReservationAction } from "@/lib/actions/reservations";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/actions/types";

const initialState: ActionState = {};

export function CancelReservationForm({ id }: { id: string }) {
	const [state, formAction] = useActionState(cancelReservationAction, initialState);

	return (
		<form action={formAction} className="inline-flex flex-col items-end gap-1">
			<input type="hidden" name="id" value={id} />
			<SubmitButton variant="destructive" size="sm" pendingText="Cancelling...">
				Cancel
			</SubmitButton>
			{state.error && <p className="text-xs text-destructive">{state.error}</p>}
		</form>
	);
}
