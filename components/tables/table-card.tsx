import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableStatusBadge } from "@/components/reservations/status-badge";
import { TableFormDialog } from "@/components/tables/table-form-dialog";
import { DeleteTableForm } from "@/components/tables/delete-table-form";
import { formatTableNumber, type BarTable } from "@/lib/types/db";

export function TableCard({ table }: { table: BarTable }) {
	return (
		<Card size="sm" className="w-full">
			<CardHeader className="flex items-start justify-between">
				<h3 className="font-semibold text-primary">{formatTableNumber(table.table_number)}</h3>
				<TableStatusBadge status={table.status} />
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<p className="text-sm text-muted-foreground">{table.capacity} seats</p>
				<div className="flex gap-2">
					<TableFormDialog table={table} />
					<DeleteTableForm id={table.id} />
				</div>
			</CardContent>
		</Card>
	);
}
