import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReservationStatusBadge } from "@/components/reservations/status-badge";
import { ReservationActions } from "@/components/reservations/reservation-actions";
import { getTodayReservations } from "@/lib/data/reservations";
import { formatTableNumber } from "@/lib/types/db";

export default async function StaffReservationsPage() {
	const reservations = await getTodayReservations();

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold text-primary">Today&apos;s Reservations</h1>

			{reservations.length === 0 ? (
				<p className="text-muted-foreground">No reservations for today.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Customer</TableHead>
							<TableHead>Table</TableHead>
							<TableHead>Time</TableHead>
							<TableHead>Guests</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{reservations.map((r) => (
							<TableRow key={r.id}>
								<TableCell>{r.customer?.full_name ?? "—"}</TableCell>
								<TableCell>{r.table ? formatTableNumber(r.table.table_number) : "—"}</TableCell>
								<TableCell>{r.reservation_time}</TableCell>
								<TableCell>{r.guest_count}</TableCell>
								<TableCell>
									<ReservationStatusBadge status={r.status} />
								</TableCell>
								<TableCell className="text-right">
									<ReservationActions id={r.id} status={r.status} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
