import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthContext } from "@/lib/auth/session";
import { getMyReservations } from "@/lib/data/reservations";
import Link from "next/link";

export default async function CustomerDashboardPage() {
	const result = await getAuthContext();
	if (!result.ok) return null;

	const reservations = await getMyReservations(result.context.user.id);
	const upcoming = reservations.filter(
		(r) => r.status === "pending" || r.status === "confirmed",
	);

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-bold text-primary">
					Welcome, {result.context.profile.full_name}
				</h1>
				<p className="text-muted-foreground">
					Manage your table reservations at OneShotBar.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Upcoming reservations</CardTitle>
					</CardHeader>
					<CardContent className="flex items-center justify-between">
						<span className="text-3xl font-bold text-primary">
							{upcoming.length}
						</span>
						<Button
							variant="outline"
							nativeButton={false}
							render={<Link href="/customer/reservations" />}>
							View all
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Reserve a table</CardTitle>
					</CardHeader>
					<CardContent>
						<Button
							nativeButton={false}
							render={<Link href="/customer/reservations/new" />}>
							Find a table
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
