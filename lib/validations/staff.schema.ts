import { z } from "zod";

export const createStaffSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
	email: z.string().trim().toLowerCase().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export type CreateStaffInput = z.infer<typeof createStaffSchema>;
