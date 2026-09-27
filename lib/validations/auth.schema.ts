import { z } from "zod";

// Public self-registration always creates a "customer" account — role is
// never accepted from the client, so a request can't self-elevate to
// "staff" or "manager". Those roles are provisioned separately (see
// supabase/migrations/0001_init_auth.sql).
export const registerSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
	email: z.string().trim().toLowerCase().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export const loginSchema = z.object({
	email: z.string().trim().toLowerCase().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
