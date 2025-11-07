import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { users } from '@repo/db/schema';
import { ApiResponse, createUserSchema } from '@repo/shared';
import type { Env, HonoVariables } from '../types';

const api = new Hono<{ Bindings: Env; Variables: HonoVariables }>();

// These are safe to delete!

/**
 * GET /api/hello - Hello World endpoint
 */
api.get('/hello', (c) => {
	return c.json<ApiResponse<{ greeting: string }>>({
		success: true,
		data: {
			greeting: 'Hello from Cloudflare Workers + Hono!',
		},
		message: 'API is working correctly',
	});
});

/**
 * GET /api/users - Get all users
 */
api.get('/users', async (c) => {
	try {
		const db = c.get('db');
		const allUsers = await db.select().from(users).all();

		return c.json<ApiResponse<typeof allUsers>>({
			success: true,
			data: allUsers,
			message: `Retrieved ${allUsers.length} users`,
		});
	} catch (error) {
		console.error('Error fetching users:', error);
		return c.json<ApiResponse>(
			{
				success: false,
				error: 'Failed to fetch users',
			},
			500
		);
	}
});

/**
 * POST /api/users - Create a new user
 */
api.post('/users', zValidator('json', createUserSchema), async (c) => {
	try {
		const db = c.get('db');
		const validatedData = c.req.valid('json');

		const result = await db.insert(users).values(validatedData).returning().get();

		return c.json<ApiResponse<typeof result>>(
			{
				success: true,
				data: result,
				message: 'User created successfully',
			},
			201
		);
	} catch (error) {
		console.error('Error creating user:', error);

		if (error instanceof Error && error.message.includes('UNIQUE')) {
			return c.json<ApiResponse>(
				{
					success: false,
					error: 'A user with this email already exists',
				},
				409
			);
		}

		return c.json<ApiResponse>(
			{
				success: false,
				error: 'Failed to create user',
			},
			500
		);
	}
});

export default api;
