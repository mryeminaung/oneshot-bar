import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReservationStatusBadge } from "@/components/reservations/status-badge";
import { ReservationActions } from "@/components/reservations/reservation-actions";
import { getAllReservations } from "@/lib/data/reservations";
import { formatTableNumber, type ReservationStatus } from "@/lib/types/db";
import { reservationStatusValues } from "@/lib/validations/reservation.schema";

export default async function ManagerReservationsPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const params = await searchParams;
	const date = typeof params.date === "string" ? params.date : undefined;
	const status =
		typeof params.status === "string" && reservationStatusValues.includes(params.status as ReservationStatus)
			? (params.status as ReservationStatus)
			: undefined;

	const reservations = await getAllReservations({ date, status });

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold text-primary">Reservations</h1>

			<Card>
				<CardContent>
					<form method="GET" className="grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
						<div className="flex flex-col gap-1">
							<label htmlFor="date" className="text-sm font-medium">
								Date
							</label>
							<Input id="date" name="date" type="date" defaultValue={date} />
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor="status" className="text-sm font-medium">
								Status
							</label>
							<select
								id="status"
								name="status"
								defaultValue={status ?? ""}
								className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
							>
								<option value="">All</option>
								{reservationStatusValues.map((s) => (
									<option key={s} value={s} className="capitalize">
										{s}
									</option>
								))}
							</select>
						</div>
						<Button type="submit">Filter</Button>
						<Button variant="outline" nativeButton={false} render={<a href="/manager/reservations" />}>
							Clear
						</Button>
					</form>
				</CardContent>
			</Card>

			{reservations.length === 0 ? (
				<p className="text-muted-foreground">No reservations match this filter.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Customer</TableHead>
							<TableHead>Table</TableHead>
							<TableHead>Date</TableHead>
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
								<TableCell>{r.reservation_date}</TableCell>
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
