import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReservationStatusBadge } from "@/components/reservations/status-badge";
import { CancelReservationForm } from "@/components/reservations/cancel-reservation-form";
import { getAuthContext } from "@/lib/auth/session";
import { getMyReservations } from "@/lib/data/reservations";
import { formatTableNumber } from "@/lib/types/db";

export default async function CustomerReservationsPage() {
	const result = await getAuthContext();
	if (!result.ok) return null;

	const reservations = await getMyReservations(result.context.user.id);

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold text-primary">My Reservations</h1>

			{reservations.length === 0 ? (
				<p className="text-muted-foreground">You haven&apos;t made any reservations yet.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Table</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Time</TableHead>
							<TableHead>Guests</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{reservations.map((r) => (
							<TableRow key={r.id}>
								<TableCell>{r.table ? formatTableNumber(r.table.table_number) : "—"}</TableCell>
								<TableCell>{r.reservation_date}</TableCell>
								<TableCell>{r.reservation_time}</TableCell>
								<TableCell>{r.guest_count}</TableCell>
								<TableCell>
									<ReservationStatusBadge status={r.status} />
								</TableCell>
								<TableCell className="text-right">
									{(r.status === "pending" || r.status === "confirmed") && (
										<CancelReservationForm id={r.id} />
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
