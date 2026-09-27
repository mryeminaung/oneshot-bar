"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableStatusBadge } from "@/components/reservations/status-badge";
import { TableFormDialog } from "@/components/tables/table-form-dialog";
import { DeleteTableForm } from "@/components/tables/delete-table-form";
import { TableCard } from "@/components/tables/table-card";
import { formatTableNumber, type BarTable } from "@/lib/types/db";
import { tableStatusValues } from "@/lib/validations/table.schema";
import { cn } from "@/lib/utils";

type View = "list" | "grid";
const STATUS_FILTERS = ["all", ...tableStatusValues] as const;

export function TablesView({ tables }: { tables: BarTable[] }) {
	const [view, setView] = useState<View>("list");
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return tables.filter((table) => {
			if (status !== "all" && table.status !== status) return false;
			if (!q) return true;
			const haystack = `${formatTableNumber(table.table_number)} ${table.capacity}`.toLowerCase();
			return haystack.includes(q);
		});
	}, [tables, search, status]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-xs">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search table or capacity..."
						className="pl-8"
					/>
				</div>

				<div className="flex items-center gap-3">
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

					<div className="flex gap-1">
						<Button
							variant={view === "list" ? "secondary" : "ghost"}
							size="icon-sm"
							aria-label="List view"
							onClick={() => setView("list")}
						>
							<List />
						</Button>
						<Button
							variant={view === "grid" ? "secondary" : "ghost"}
							size="icon-sm"
							aria-label="Grid view"
							onClick={() => setView("grid")}
						>
							<LayoutGrid />
						</Button>
					</div>
				</div>
			</div>

			<p className="text-sm text-muted-foreground">
				{filtered.length} of {tables.length} tables
			</p>

			{filtered.length === 0 ? (
				<p className="text-sm text-muted-foreground">No tables match your search.</p>
			) : view === "list" ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Table</TableHead>
							<TableHead>Capacity</TableHead>
							<TableHead>Status</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.map((table) => (
							<TableRow key={table.id}>
								<TableCell>{formatTableNumber(table.table_number)}</TableCell>
								<TableCell>{table.capacity} seats</TableCell>
								<TableCell>
									<TableStatusBadge status={table.status} />
								</TableCell>
								<TableCell className="text-right">
									<div className="flex justify-end gap-2">
										<TableFormDialog table={table} />
										<DeleteTableForm id={table.id} />
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((table) => (
						<TableCard key={table.id} table={table} />
					))}
				</div>
			)}
		</div>
	);
}
