/**
 * Database seeding script
 *
 * To seed the database:
 * 1. Apply migrations: bun run db:migrate
 * 2. Run seed commands below
 */

const demoUsers = [
	{ name: 'Alice Johnson', email: 'alice@example.com' },
	{ name: 'Bob Smith', email: 'bob@example.com' },
	{ name: 'Charlie Davis', email: 'charlie@example.com' },
];

console.log('🌱 Demo seed data for users:');
console.log('');
demoUsers.forEach((user, i) => {
	console.log(`bunx wrangler d1 execute cloudflare-d1-db --local --command "INSERT INTO users (name, email) VALUES ('${user.name}', '${user.email}')"`);
});

export { demoUsers };
