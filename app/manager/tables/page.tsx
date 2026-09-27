import { TableFormDialog } from "@/components/tables/table-form-dialog";
import { TablesView } from "@/components/tables/tables-view";
import { getTables } from "@/lib/data/tables";

export default async function ManagerTablesPage() {
	const tables = await getTables();

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold text-primary">Tables</h1>
				<TableFormDialog />
			</div>

			{tables.length === 0 ? (
				<p className="text-muted-foreground">No tables yet. Add your first one.</p>
			) : (
				<TablesView tables={tables} />
			)}
		</div>
	);
}
