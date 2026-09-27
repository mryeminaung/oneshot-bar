import { CalendarClock, Armchair, UtensilsCrossed, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentReservationsTable } from "@/components/dashboard/recent-reservations-table";
import { getDashboardStats } from "@/lib/data/reservations";

export default async function ManagerDashboardPage() {
	const stats = await getDashboardStats();

	const cards = [
		{ label: "Today's Reservations", value: stats.todayReservationsCount, icon: CalendarClock },
		{ label: "Available Tables", value: stats.availableTablesCount, icon: Armchair },
		{ label: "Reserved Tables", value: stats.reservedTablesCount, icon: UtensilsCrossed },
		{ label: "Total Customers", value: stats.totalCustomersCount, icon: Users },
	];

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold text-primary">Dashboard</h1>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{cards.map((card) => (
					<Card key={card.label}>
						<CardHeader className="flex flex-row items-center justify-between">
							<CardTitle className="text-sm text-muted-foreground">{card.label}</CardTitle>
							<card.icon className="size-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<span className="text-3xl font-bold text-primary">{card.value}</span>
						</CardContent>
					</Card>
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Recent Reservations</CardTitle>
				</CardHeader>
				<CardContent>
					{stats.recentReservations.length === 0 ? (
						<p className="text-muted-foreground">No reservations yet.</p>
					) : (
						<RecentReservationsTable reservations={stats.recentReservations} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}
