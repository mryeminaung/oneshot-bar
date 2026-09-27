"use client";

import { useActionState } from "react";
import { deleteStaffAction } from "@/lib/actions/staff";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/actions/types";

const initialState: ActionState = {};

export function DeleteStaffForm({ id }: { id: string }) {
	const [state, formAction] = useActionState(deleteStaffAction, initialState);

	return (
		<form action={formAction} className="inline-flex flex-col items-end gap-1">
			<input type="hidden" name="id" value={id} />
			<SubmitButton variant="destructive" size="sm" pendingText="Removing...">
				Remove
			</SubmitButton>
			{state.error && <p className="text-xs text-destructive">{state.error}</p>}
		</form>
	);
}
