import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/')({
	component: HomePage,
});

function HomePage() {
	const queryClient = useQueryClient();
	const [showHello, setShowHello] = useState(false);
	const [showUsers, setShowUsers] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	// Hello API call
	const {
		data: helloData,
		isLoading: helloLoading,
		refetch: refetchHello,
	} = useQuery({
		queryKey: ['hello'],
		queryFn: async () => {
			const response = await apiClient.api.hello.$get();
			return response.json();
		},
		enabled: false,
	});

	// Users API call
	const {
		data: usersData,
		isLoading: usersLoading,
		refetch: refetchUsers,
	} = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			const response = await apiClient.api.users.$get();
			return response.json();
		},
		enabled: false,
	});

	// Create user mutation
	const createUserMutation = useMutation({
		mutationFn: async (userData: { name: string; email: string }) => {
			const response = await apiClient.api.users.$post({ json: userData });
			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			setName('');
			setEmail('');
			if (showUsers) {
				refetchUsers();
			}
		},
	});

	const handleCallHello = () => {
		setShowHello(true);
		refetchHello();
	};

	const handleCallUsers = () => {
		setShowUsers(true);
		refetchUsers();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name && email) {
			createUserMutation.mutate({ name, email });
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-8">
			<div className="text-center mb-12">
				<div className="text-6xl mb-4">🦫</div>
				<h1 className="text-5xl font-bold mb-2">bhvr</h1>
				<p className="text-xl mb-2">Bun + Hono + Vite + React</p>
				<p className="text-sm text-muted-foreground">A typesafe fullstack monorepo</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
				{/* Call Hello API */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Hello World API</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button onClick={handleCallHello} className="w-full" disabled={helloLoading}>
							{helloLoading ? 'Loading...' : 'Call API'}
						</Button>
						{showHello && helloData && (
							<div className="p-4 bg-secondary rounded-md">
								<pre className="text-xs overflow-auto">{JSON.stringify(helloData, null, 2)}</pre>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Fetch Users */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Fetch Users</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<Button onClick={handleCallUsers} className="w-full" disabled={usersLoading}>
							{usersLoading ? 'Loading...' : 'Call API'}
						</Button>
						{showUsers && usersData && (
							<div className="p-4 bg-secondary rounded-md max-h-64 overflow-auto">
								<pre className="text-xs">{JSON.stringify(usersData, null, 2)}</pre>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Add User Form */}
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Add New User</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									placeholder="John Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="john@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>
							<Button type="submit" className="w-full" disabled={createUserMutation.isPending}>
								{createUserMutation.isPending ? 'Creating...' : 'Create User'}
							</Button>
							{createUserMutation.isSuccess && (
								<p className="text-sm text-center text-green-600">✓ User created!</p>
							)}
							{createUserMutation.isError && (
								<p className="text-sm text-center text-destructive">Error creating user</p>
							)}
						</form>
					</CardContent>
				</Card>
			</div>

			{/* Tech Stack Section */}
			<div className="mt-16 w-full max-w-6xl">
				<h2 className="text-3xl font-bold text-center mb-8">Tech Stack & Architecture</h2>

				{/* Architecture Flow with integrated docs */}
				<div className="space-y-8">
					{/* Frontend Layer */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<span className="text-2xl">🎨</span>
								Frontend Layer
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-center gap-3 flex-wrap mb-6">
								<a
									href="https://react.dev"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									React 18
								</a>
								<span className="text-2xl">→</span>
								<a
									href="https://vitejs.dev"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									Vite
								</a>
								<span className="text-2xl">→</span>
								<a
									href="https://tailwindcss.com"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									Tailwind CSS
								</a>
								<span className="text-xl">+</span>
								<a
									href="https://ui.shadcn.com"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									Shadcn UI
								</a>
							</div>
							<p className="text-sm text-center text-muted-foreground">
								Build beautiful, responsive UIs with React, styled with Tailwind CSS v4 and Shadcn
								components, bundled lightning-fast with Vite
							</p>
						</CardContent>
					</Card>

					{/* State & Routing Layer */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<span className="text-2xl">🔄</span>
								State & Routing
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-center gap-3 flex-wrap mb-6">
								<a
									href="https://tanstack.com/router"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									TanStack Router
								</a>
								<span className="text-xl">+</span>
								<a
									href="https://tanstack.com/query"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									TanStack Query
								</a>
								<span className="text-xl">+</span>
								<a
									href="https://zustand-demo.pmnd.rs"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									Zustand
								</a>
							</div>
							<p className="text-sm text-center text-muted-foreground">
								Type-safe file-based routing, powerful async state management, and lightweight
								client state - all working together seamlessly
							</p>
						</CardContent>
					</Card>

					{/* API Layer */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<span className="text-2xl">⚡</span>
								Type-Safe API
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-center gap-3 flex-wrap mb-6">
								<div className="px-4 py-2 bg-accent text-accent-foreground rounded-md font-medium text-sm">
									Frontend
								</div>
								<span className="text-2xl">↔</span>
								<a
									href="https://hono.dev/guides/rpc"
									target="_blank"
									rel="noopener noreferrer"
									className="px-5 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-base hover:opacity-90 transition-opacity shadow-lg"
								>
									Hono RPC
								</a>
								<span className="text-2xl">↔</span>
								<div className="px-4 py-2 bg-accent text-accent-foreground rounded-md font-medium text-sm">
									Backend
								</div>
							</div>
							<p className="text-sm text-center text-muted-foreground">
								End-to-end type safety from frontend to backend - autocomplete, type inference, and
								compile-time checks for API calls
							</p>
						</CardContent>
					</Card>

					{/* Backend Layer */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<span className="text-2xl">⚙️</span>
								Backend Layer
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-center gap-3 flex-wrap mb-6">
								<a
									href="https://developers.cloudflare.com/workers"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									Cloudflare Workers
								</a>
								<span className="text-2xl">→</span>
								<a
									href="https://hono.dev"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									Hono
								</a>
								<span className="text-2xl">→</span>
								<a
									href="https://orm.drizzle.team"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									Drizzle ORM
								</a>
								<span className="text-2xl">→</span>
								<a
									href="https://developers.cloudflare.com/d1"
									target="_blank"
									rel="noopener noreferrer"
									className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:opacity-90 transition-opacity"
								>
									D1 Database
								</a>
							</div>
							<p className="text-sm text-center text-muted-foreground">
								Serverless edge runtime with Hono framework, type-safe database queries with
								Drizzle, and SQLite at the edge with D1
							</p>
						</CardContent>
					</Card>

					{/* Cross-cutting Concerns */}
					<Card className="bg-muted/50">
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<span className="text-2xl">🛠️</span>
								Foundation & Tooling
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
								<div>
									<a
										href="https://www.typescriptlang.org"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block px-4 py-2 bg-card border rounded-md font-medium text-sm hover:bg-accent transition-colors"
									>
										TypeScript
									</a>
									<p className="text-xs text-muted-foreground mt-2">Type safety everywhere</p>
								</div>
								<div>
									<a
										href="https://zod.dev"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block px-4 py-2 bg-card border rounded-md font-medium text-sm hover:bg-accent transition-colors"
									>
										Zod
									</a>
									<p className="text-xs text-muted-foreground mt-2">Runtime validation</p>
								</div>
								<div>
									<a
										href="https://bun.sh"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block px-4 py-2 bg-card border rounded-md font-medium text-sm hover:bg-accent transition-colors"
									>
										Bun
									</a>
									<span className="mx-2 text-muted-foreground">+</span>
									<a
										href="https://turbo.build/repo"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block px-4 py-2 bg-card border rounded-md font-medium text-sm hover:bg-accent transition-colors"
									>
										Turborepo
									</a>
									<p className="text-xs text-muted-foreground mt-2">Fast builds & monorepo</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Deployment */}
					<Card className="border-2 border-primary/20">
						<CardHeader>
							<CardTitle className="text-lg flex items-center gap-2">
								<span className="text-2xl">🚀</span>
								Deployment
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-center gap-6 flex-wrap">
								<div className="text-center">
									<a
										href="https://developers.cloudflare.com/pages"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
									>
										Cloudflare Pages
									</a>
									<p className="text-xs text-muted-foreground mt-2">Frontend hosting</p>
								</div>
								<span className="text-2xl text-muted-foreground">+</span>
								<div className="text-center">
									<a
										href="https://developers.cloudflare.com/workers"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
									>
										Cloudflare Workers
									</a>
									<p className="text-xs text-muted-foreground mt-2">Backend runtime</p>
								</div>
								<span className="text-2xl text-muted-foreground">+</span>
								<div className="text-center">
									<a
										href="https://developers.cloudflare.com/d1"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
									>
										D1 Database
									</a>
									<p className="text-xs text-muted-foreground mt-2">Edge database</p>
								</div>
							</div>
							<p className="text-sm text-center text-muted-foreground mt-6">
								All deployed on Cloudflare's global edge network - fast, scalable, and generous free
								tier
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className="mt-12 text-center">
				<p className="text-xs text-muted-foreground">
					Built with ❤️ using Cloudflare's edge platform
				</p>
			</div>
		</div>
	);
}
