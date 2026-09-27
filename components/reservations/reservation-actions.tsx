import { StatusButtonForm } from "@/components/reservations/status-button-form";
import type { ReservationStatus } from "@/lib/types/db";

export function ReservationActions({ id, status }: { id: string; status: ReservationStatus }) {
	if (status === "pending") {
		return (
			<div className="flex justify-end gap-2">
				<StatusButtonForm id={id} status="confirmed" label="Confirm" />
				<StatusButtonForm id={id} status="cancelled" label="Cancel" variant="destructive" />
			</div>
		);
	}

	if (status === "confirmed") {
		return (
			<div className="flex justify-end gap-2">
				<StatusButtonForm id={id} status="completed" label="Complete" />
				<StatusButtonForm id={id} status="cancelled" label="Cancel" variant="destructive" />
			</div>
		);
	}

	return <span className="text-xs text-muted-foreground">No actions</span>;
}
