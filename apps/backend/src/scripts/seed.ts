/**
 * Database seeding script
 * Run with: bun run src/scripts/seed.ts
 */

import { users, posts } from '@repo/db/schema';

// Demo users data
const demoUsers = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
  },
  {
    name: 'Charlie Davis',
    email: 'charlie@example.com',
  },
];

// Demo posts data
const demoPosts = [
  {
    title: 'Getting Started with Cloudflare Workers',
    content:
      'Cloudflare Workers provide a serverless execution environment that allows you to create entirely new applications or augment existing ones.',
    authorId: 1,
    published: true,
  },
  {
    title: 'Introduction to Hono Framework',
    content:
      'Hono is a small, simple, and ultrafast web framework for Cloudflare Workers, Deno, Bun, and others.',
    authorId: 1,
    published: true,
  },
  {
    title: 'Building Type-Safe APIs',
    content:
      'End-to-end type safety ensures that your frontend and backend are always in sync, reducing bugs and improving developer experience.',
    authorId: 2,
    published: true,
  },
  {
    title: 'Why Choose D1?',
    content:
      "Cloudflare D1 is Cloudflare's native serverless database. It's built on SQLite and provides a simple, fast, and cost-effective solution.",
    authorId: 3,
    published: false,
  },
];

console.log('🌱 Seeding database...');
console.log('');
console.log('📝 Demo Users:', demoUsers);
console.log('📄 Demo Posts:', demoPosts);
console.log('');
console.log('To seed the database:');
console.log('1. First generate migrations: bun run db:generate');
console.log('2. Then apply migrations: bun run db:migrate');
console.log('3. Insert data manually using wrangler d1 execute or via API');
console.log('');
console.log('Example wrangler commands:');
console.log(
  `  wrangler d1 execute cloudflare-d1-db --local --command "INSERT INTO users (name, email) VALUES ('Alice Johnson', 'alice@example.com')"`
);

export { demoUsers, demoPosts };

