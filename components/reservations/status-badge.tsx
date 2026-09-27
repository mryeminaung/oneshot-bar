import { Badge } from "@/components/ui/badge";
import type { ReservationStatus, TableStatus } from "@/lib/types/db";

const RESERVATION_VARIANT: Record<ReservationStatus, "default" | "secondary" | "outline" | "destructive"> = {
	pending: "secondary",
	confirmed: "default",
	completed: "outline",
	cancelled: "destructive",
};

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
	return (
		<Badge variant={RESERVATION_VARIANT[status]} className="capitalize">
			{status}
		</Badge>
	);
}

const TABLE_STATUS_VARIANT: Record<TableStatus, "default" | "outline"> = {
	available: "default",
	unavailable: "outline",
};

export function TableStatusBadge({ status }: { status: TableStatus }) {
	return (
		<Badge variant={TABLE_STATUS_VARIANT[status]} className="capitalize">
			{status}
		</Badge>
	);
}
