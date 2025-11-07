import { z } from 'zod';

/**
 * User validation schemas
 */
export const createUserSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
	email: z.string().email('Invalid email address'),
});

export const userIdSchema = z.object({
	id: z.coerce.number().int().positive(),
});

/**
 * Type inference from schemas
 */
export type CreateUserInput = z.infer<typeof createUserSchema>;
