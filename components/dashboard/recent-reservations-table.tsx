"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReservationStatusBadge } from "@/components/reservations/status-badge";
import { formatTableNumber, type ReservationWithDetails } from "@/lib/types/db";
import { reservationStatusValues } from "@/lib/validations/reservation.schema";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = ["all", ...reservationStatusValues] as const;

export function RecentReservationsTable({ reservations }: { reservations: ReservationWithDetails[] }) {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return reservations.filter((r) => {
			if (status !== "all" && r.status !== status) return false;
			if (!q) return true;
			const haystack = `${r.customer?.full_name ?? ""} ${r.table ? formatTableNumber(r.table.table_number) : ""}`.toLowerCase();
			return haystack.includes(q);
		});
	}, [reservations, search, status]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-xs">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search customer or table..."
						className="pl-8"
					/>
				</div>
				<div className="flex flex-wrap gap-1">
					{STATUS_FILTERS.map((s) => (
						<button
							key={s}
							type="button"
							onClick={() => setStatus(s)}
							className={cn(
								"rounded-full border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
								status === s
									? "border-primary bg-primary text-primary-foreground"
									: "border-border text-muted-foreground hover:text-foreground"
							)}
						>
							{s}
						</button>
					))}
				</div>
			</div>

			{filtered.length === 0 ? (
				<p className="text-sm text-muted-foreground">No reservations match your search.</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Table</TableHead>
							<TableHead>Date</TableHead>
							<TableHead>Time</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.map((r, i) => (
							<TableRow key={r.id}>
								<TableCell className="font-mono text-muted-foreground">
									#{String(i + 1).padStart(3, "0")}
								</TableCell>
								<TableCell>{r.customer?.full_name ?? "—"}</TableCell>
								<TableCell>{r.table ? formatTableNumber(r.table.table_number) : "—"}</TableCell>
								<TableCell>{r.reservation_date}</TableCell>
								<TableCell>{r.reservation_time}</TableCell>
								<TableCell>
									<ReservationStatusBadge status={r.status} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
