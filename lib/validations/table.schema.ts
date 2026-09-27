import { z } from "zod";

export const tableStatusValues = ["available", "unavailable"] as const;

export const createTableSchema = z.object({
	table_number: z.coerce.number().int().positive("Table number must be positive"),
	capacity: z.coerce.number().int().positive("Capacity must be positive"),
	status: z.enum(tableStatusValues).default("available"),
});

export const updateTableSchema = createTableSchema.extend({
	id: z.string().uuid(),
});

export type CreateTableInput = z.infer<typeof createTableSchema>;
export type UpdateTableInput = z.infer<typeof updateTableSchema>;
