import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { users, posts } from '@repo/db/schema';
import { createUserSchema, userIdSchema, ApiResponse } from '@repo/shared';
import type { Env, HonoVariables } from '../types';
import { eq } from 'drizzle-orm';

const api = new Hono<{ Bindings: Env; Variables: HonoVariables }>();

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
 * GET /api/users/:id - Get a single user by ID
 */
api.get('/users/:id', zValidator('param', userIdSchema), async (c) => {
  try {
    const { id } = c.req.valid('param');
    const db = c.get('db');

    const user = await db.select().from(users).where(eq(users.id, id)).get();

    if (!user) {
      return c.json<ApiResponse>(
        {
          success: false,
          error: 'User not found',
        },
        404
      );
    }

    return c.json<ApiResponse<typeof user>>({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return c.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch user',
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
    const userData = c.req.valid('json');
    const db = c.get('db');

    const newUser = await db
      .insert(users)
      .values(userData)
      .returning()
      .get();

    return c.json<ApiResponse<typeof newUser>>(
      {
        success: true,
        data: newUser,
        message: 'User created successfully',
      },
      201
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to create user',
      },
      500
    );
  }
});

/**
 * GET /api/posts - Get all posts
 */
api.get('/posts', async (c) => {
  try {
    const db = c.get('db');
    const allPosts = await db.select().from(posts).all();

    return c.json<ApiResponse<typeof allPosts>>({
      success: true,
      data: allPosts,
      message: `Retrieved ${allPosts.length} posts`,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return c.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch posts',
      },
      500
    );
  }
});

export default api;

