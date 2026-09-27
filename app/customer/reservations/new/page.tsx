import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvailableTableCard } from "@/components/reservations/available-table-card";
import { getAvailableTables } from "@/lib/data/tables";
import { availabilitySearchSchema } from "@/lib/validations/reservation.schema";

function todayStr() {
	return new Date().toISOString().slice(0, 10);
}

export default async function NewReservationPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const params = await searchParams;

	const parsed = availabilitySearchSchema.safeParse({
		reservation_date: params.reservation_date,
		reservation_time: params.reservation_time,
		guest_count: params.guest_count,
	});

	const searched = typeof params.reservation_date === "string";

	const tables = parsed.success
		? await getAvailableTables({
				reservationDate: parsed.data.reservation_date,
				reservationTime: parsed.data.reservation_time,
				guestCount: parsed.data.guest_count,
			})
		: [];

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold text-primary">Reserve a Table</h1>

			<Card>
				<CardContent>
					<form method="GET" className="grid gap-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
						<div className="flex flex-col gap-1">
							<label htmlFor="reservation_date" className="text-sm font-medium">
								Date
							</label>
							<Input
								id="reservation_date"
								name="reservation_date"
								type="date"
								min={todayStr()}
								defaultValue={typeof params.reservation_date === "string" ? params.reservation_date : todayStr()}
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor="reservation_time" className="text-sm font-medium">
								Time
							</label>
							<Input
								id="reservation_time"
								name="reservation_time"
								type="time"
								defaultValue={typeof params.reservation_time === "string" ? params.reservation_time : "19:00"}
								required
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label htmlFor="guest_count" className="text-sm font-medium">
								Guests
							</label>
							<Input
								id="guest_count"
								name="guest_count"
								type="number"
								min={1}
								defaultValue={typeof params.guest_count === "string" ? params.guest_count : "2"}
								required
							/>
						</div>
						<Button type="submit">Search</Button>
					</form>
				</CardContent>
			</Card>

			{searched && !parsed.success && (
				<p className="text-sm text-destructive">{parsed.error.issues[0]?.message ?? "Invalid search."}</p>
			)}

			{searched && parsed.success && tables.length === 0 && (
				<p className="text-muted-foreground">No tables available for that date, time, and party size.</p>
			)}

			{parsed.success && tables.length > 0 && (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{tables.map((table) => (
						<AvailableTableCard
							key={table.id}
							table={table}
							reservationDate={parsed.data.reservation_date}
							reservationTime={parsed.data.reservation_time}
							guestCount={parsed.data.guest_count}
						/>
					))}
				</div>
			)}
		</div>
	);
}
