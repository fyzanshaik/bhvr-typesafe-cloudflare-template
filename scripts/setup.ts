#!/usr/bin/env bun
/**
 * Interactive Setup Script
 *
 * This script will:
 * 1. Check if Bun is installed
 * 2. Check Cloudflare authentication status
 * 3. Help create D1 database
 * 4. Update wrangler.toml with database_id
 * 5. Apply database migrations
 * 6. Seed demo data
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { $ } from 'bun';

const RESET = '\x1b[0m';
const BRIGHT = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RED = '\x1b[31m';

function log(message: string) {
	console.log(`${BRIGHT}${message}${RESET}`);
}

function success(message: string) {
	console.log(`${GREEN}✓${RESET} ${message}`);
}

function info(message: string) {
	console.log(`${BLUE}ℹ${RESET} ${message}`);
}

function warning(message: string) {
	console.log(`${YELLOW}⚠${RESET} ${message}`);
}

function error(message: string) {
	console.log(`${RED}✗${RESET} ${message}`);
}

async function checkBun() {
	log('\n📦 Checking Bun installation...');
	try {
		const version = await $`bun --version`.text();
		success(`Bun ${version.trim()} is installed`);
		return true;
	} catch {
		error('Bun is not installed');
		info('Install from: https://bun.sh');
		return false;
	}
}

async function checkWranglerAuth() {
	log('\n🔐 Checking Cloudflare authentication...');
	try {
		await $`bunx wrangler whoami`.quiet();
		success('You are logged in to Cloudflare');
		return true;
	} catch {
		warning('You are not logged in to Cloudflare');
		info('Run: bunx wrangler login');
		return false;
	}
}

async function createD1Database() {
	log('\n🗄️  Creating D1 Database...');
	info('This will create a new D1 database in your Cloudflare account');

	const dbName = 'bhvr-db';

	try {
		const output = await $`bunx wrangler d1 create ${dbName}`.text();

		// Extract database_id from output
		const match = output.match(/database_id\s*=\s*"([^"]+)"/);
		if (match?.[1]) {
			const databaseId = match[1];
			success(`Created database: ${dbName}`);
			info(`Database ID: ${databaseId}`);
			return databaseId;
		}

		warning('Could not extract database_id automatically');
		info('Please copy the database_id from the output above');
		return null;
	} catch (err) {
		error('Failed to create database');
		console.error(err);
		return null;
	}
}

async function updateWranglerToml(databaseId: string) {
	log('\n📝 Updating wrangler.toml...');

	const wranglerPath = join(process.cwd(), 'apps', 'backend', 'wrangler.toml');

	try {
		let content = await readFile(wranglerPath, 'utf-8');

		// Update production database_id
		content = content.replace(
			/(\[env\.production\.d1_databases\][\s\S]*?database_id\s*=\s*)"[^"]*"/,
			`$1"${databaseId}"`
		);

		await writeFile(wranglerPath, content);
		success('Updated wrangler.toml with production database_id');
		return true;
	} catch (err) {
		error('Failed to update wrangler.toml');
		console.error(err);
		return false;
	}
}

async function applyMigrations() {
	log('\n🔨 Applying database migrations...');

	try {
		info('Applying to local database...');
		await $`cd apps/backend && bun run db:migrate`;
		success('Local migrations applied');

		return true;
	} catch (err) {
		error('Failed to apply migrations');
		console.error(err);
		return false;
	}
}

async function seedData() {
	log('\n🌱 Seeding demo data...');

	try {
		await $`cd apps/backend && bunx wrangler d1 execute cloudflare-d1-db --local --command "INSERT INTO users (name, email) VALUES ('Alice Johnson', 'alice@example.com'), ('Bob Smith', 'bob@example.com'), ('Charlie Davis', 'charlie@example.com')"`;
		success('Demo data seeded');
		return true;
	} catch (err) {
		warning('Failed to seed data (might already exist)');
		return true; // Non-critical
	}
}

async function main() {
	console.clear();
	log('🦫 bhvr - Cloudflare Fullstack Setup');
	log('=====================================\n');

	info('This script will help you set up your development environment');
	info('and production Cloudflare resources.\n');

	// Step 1: Check Bun
	const hasBun = await checkBun();
	if (!hasBun) {
		process.exit(1);
	}

	// Step 2: Check Wrangler auth
	const isAuthenticated = await checkWranglerAuth();
	if (!isAuthenticated) {
		info('\nPlease run the following command first:');
		console.log('  bunx wrangler login\n');
		process.exit(1);
	}

	// Step 3: Create D1 database
	const databaseId = await createD1Database();
	if (!databaseId) {
		warning('\nPlease create the database manually:');
		console.log('  bunx wrangler d1 create bhvr-db');
		console.log('\nThen update apps/backend/wrangler.toml with the database_id\n');
		process.exit(1);
	}

	// Step 4: Update wrangler.toml
	const updated = await updateWranglerToml(databaseId);
	if (!updated) {
		process.exit(1);
	}

	// Step 5: Apply migrations
	const migrated = await applyMigrations();
	if (!migrated) {
		process.exit(1);
	}

	// Step 6: Seed data
	await seedData();

	// Success!
	log('\n✨ Setup Complete!\n');
	success('Your environment is ready for development\n');

	info('Next steps:');
	console.log('  1. Run: bun dev');
	console.log('  2. Open: http://localhost:5173');
	console.log('  3. Start coding!\n');

	info('To deploy to production:');
	console.log('  cd apps/backend && bun run deploy\n');
}

main().catch((err) => {
	error('\nSetup failed');
	console.error(err);
	process.exit(1);
});
