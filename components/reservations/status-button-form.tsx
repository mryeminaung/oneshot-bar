"use client";

import { useActionState } from "react";
import { updateReservationStatusAction } from "@/lib/actions/reservations";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/actions/types";
import type { ReservationStatus } from "@/lib/types/db";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

const initialState: ActionState = {};

export function StatusButtonForm({
	id,
	status,
	label,
	variant,
}: {
	id: string;
	status: ReservationStatus;
	label: string;
	variant?: ComponentProps<typeof Button>["variant"];
}) {
	const [state, formAction] = useActionState(updateReservationStatusAction, initialState);

	return (
		<form action={formAction} className="inline-flex flex-col items-end gap-1">
			<input type="hidden" name="id" value={id} />
			<input type="hidden" name="status" value={status} />
			<SubmitButton variant={variant} size="sm" pendingText="Updating...">
				{label}
			</SubmitButton>
			{state.error && <p className="text-xs text-destructive">{state.error}</p>}
		</form>
	);
}
