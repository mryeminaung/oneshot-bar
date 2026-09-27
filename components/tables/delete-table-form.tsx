"use client";

import { useActionState } from "react";
import { deleteTableAction } from "@/lib/actions/tables";
import { SubmitButton } from "@/components/submit-button";
import type { ActionState } from "@/lib/actions/types";

const initialState: ActionState = {};

export function DeleteTableForm({ id }: { id: string }) {
	const [state, formAction] = useActionState(deleteTableAction, initialState);

	return (
		<form action={formAction} className="inline-flex flex-col items-end gap-1">
			<input type="hidden" name="id" value={id} />
			<SubmitButton variant="destructive" size="sm" pendingText="Deleting...">
				Delete
			</SubmitButton>
			{state.error && <p className="text-xs text-destructive">{state.error}</p>}
		</form>
	);
}
