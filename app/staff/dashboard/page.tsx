import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableStatusBadge } from "@/components/reservations/status-badge";
import { getTodayReservations } from "@/lib/data/reservations";
import { getTables } from "@/lib/data/tables";
import { formatTableNumber } from "@/lib/types/db";

export default async function StaffDashboardPage() {
	const [todayReservations, tables] = await Promise.all([getTodayReservations(), getTables()]);

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold text-primary">Staff Dashboard</h1>

			<Card>
				<CardHeader>
					<CardTitle>Today&apos;s reservations</CardTitle>
				</CardHeader>
				<CardContent>
					<span className="text-3xl font-bold text-primary">{todayReservations.length}</span>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Table availability</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{tables.map((table) => (
						<div
							key={table.id}
							className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
						>
							<div>
								<p className="font-medium">{formatTableNumber(table.table_number)}</p>
								<p className="text-xs text-muted-foreground">{table.capacity} seats</p>
							</div>
							<TableStatusBadge status={table.status} />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
