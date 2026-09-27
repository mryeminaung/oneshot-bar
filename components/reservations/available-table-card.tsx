import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReserveForm } from "@/components/reservations/reserve-form";
import { formatTableNumber, type BarTable } from "@/lib/types/db";

export function AvailableTableCard({
	table,
	reservationDate,
	reservationTime,
	guestCount,
}: {
	table: BarTable;
	reservationDate: string;
	reservationTime: string;
	guestCount: number;
}) {
	return (
		<Card size="sm" className="w-full">
			<CardHeader>
				<h3 className="font-semibold text-primary">{formatTableNumber(table.table_number)}</h3>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<p className="text-sm text-muted-foreground">{table.capacity} seats</p>
				<ReserveForm
					tableId={table.id}
					reservationDate={reservationDate}
					reservationTime={reservationTime}
					guestCount={guestCount}
				/>
			</CardContent>
		</Card>
	);
}
