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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubmitButton } from "@/components/submit-button";
import { createTableAction, updateTableAction } from "@/lib/actions/tables";
import type { ActionState } from "@/lib/actions/types";
import type { BarTable } from "@/lib/types/db";

const initialState: ActionState = {};

export function TableFormDialog({ table }: { table?: BarTable }) {
	const isEdit = Boolean(table);
	const [open, setOpen] = useState(false);
	const [state, formAction] = useActionState(isEdit ? updateTableAction : createTableAction, initialState);
	const [handledSuccess, setHandledSuccess] = useState(state.success);

	if (state.success !== handledSuccess) {
		setHandledSuccess(state.success);
		if (state.success) setOpen(false);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button variant={isEdit ? "outline" : "default"} size={isEdit ? "sm" : "default"} />}>
				{isEdit ? "Edit" : "Add Table"}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{isEdit ? "Edit Table" : "Add Table"}</DialogTitle>
				</DialogHeader>
				<form action={formAction} className="flex flex-col gap-4">
					{isEdit && <input type="hidden" name="id" value={table!.id} />}
					<div className="flex flex-col gap-1">
						<Label htmlFor="table_number">Table number</Label>
						<Input
							id="table_number"
							name="table_number"
							type="number"
							min={1}
							defaultValue={table?.table_number}
							required
						/>
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="capacity">Seating capacity</Label>
						<Input id="capacity" name="capacity" type="number" min={1} defaultValue={table?.capacity} required />
					</div>
					<div className="flex flex-col gap-1">
						<Label htmlFor="status">Status</Label>
						<Select name="status" defaultValue={table?.status ?? "available"}>
							<SelectTrigger id="status" className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="available">Available</SelectItem>
								<SelectItem value="unavailable">Unavailable</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{state.error && <p className="text-sm text-destructive">{state.error}</p>}
					<DialogFooter>
						<SubmitButton pendingText="Saving...">{isEdit ? "Save changes" : "Create table"}</SubmitButton>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
