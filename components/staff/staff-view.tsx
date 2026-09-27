"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteStaffForm } from "@/components/staff/delete-staff-form";
import { StaffCard } from "@/components/staff/staff-card";
import type { Profile } from "@/lib/auth/types";
import { cn } from "@/lib/utils";

type View = "list" | "grid";
const ADDED_FILTERS = ["all", "past week", "past month"] as const;
type AddedFilter = (typeof ADDED_FILTERS)[number];

function withinFilter(createdAt: string, filter: AddedFilter): boolean {
	if (filter === "all") return true;
	const days = filter === "past week" ? 7 : 30;
	const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
	return new Date(createdAt).getTime() >= cutoff;
}

export function StaffView({ staff }: { staff: Profile[] }) {
	const [view, setView] = useState<View>("list");
	const [search, setSearch] = useState("");
	const [added, setAdded] = useState<AddedFilter>("all");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return staff.filter((member) => {
			if (!withinFilter(member.created_at, added)) return false;
			if (!q) return true;
			return `${member.full_name} ${member.email}`.toLowerCase().includes(q);
		});
	}, [staff, search, added]);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative w-full sm:max-w-xs">
					<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search name or email..."
						className="pl-8"
					/>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex flex-wrap gap-1">
						{ADDED_FILTERS.map((f) => (
							<button
								key={f}
								type="button"
								onClick={() => setAdded(f)}
								className={cn(
									"rounded-full border px-2.5 py-1 text-xs font-medium capitalize transition-colors",
									added === f
										? "border-primary bg-primary text-primary-foreground"
										: "border-border text-muted-foreground hover:text-foreground"
								)}
							>
								{f}
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
				{filtered.length} of {staff.length} staff
			</p>

			{filtered.length === 0 ? (
				<p className="text-sm text-muted-foreground">No staff match your search.</p>
			) : view === "list" ? (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filtered.map((member) => (
							<TableRow key={member.id}>
								<TableCell>{member.full_name}</TableCell>
								<TableCell>{member.email}</TableCell>
								<TableCell className="text-right">
									<DeleteStaffForm id={member.id} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((member) => (
						<StaffCard key={member.id} member={member} />
					))}
				</div>
			)}
		</div>
	);
}
