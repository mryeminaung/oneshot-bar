"use client";

import { useActionState, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import { createStaffAction } from "@/lib/actions/staff";
import type { ActionState } from "@/lib/actions/types";

const initialState: ActionState = {};

export function CreateStaffDialog() {
	const [open, setOpen] = useState(false);
	const [state, formAction] = useActionState(createStaffAction, initialState);
	const [handledSuccess, setHandledSuccess] = useState(state.success);

	if (state.success !== handledSuccess) {
		setHandledSuccess(state.success);
		if (state.success) setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button />}>Add Staff</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Staff Member</DialogTitle>
				</DialogHeader>
				<form action={formAction} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1">
						<Label htmlFor="staff-name">Full name</Label>
						<Input id="staff-name" name="name" required />
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="staff-email">Email</Label>
						<Input id="staff-email" name="email" type="email" required />
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="staff-password">Temporary password</Label>
						<Input id="staff-password" name="password" type="password" minLength={8} required />
					</div>
					{state.error && <p className="text-sm text-destructive">{state.error}</p>}
					<DialogFooter>
						<SubmitButton pendingText="Creating...">Create account</SubmitButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
