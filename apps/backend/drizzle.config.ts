import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: '../../packages/db/src/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
});

