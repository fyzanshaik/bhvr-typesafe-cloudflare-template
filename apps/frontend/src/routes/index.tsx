import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { apiClient } from '@/lib/api';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      const response = await apiClient.hello.$get();
      return response.json();
    },
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Cloudflare Fullstack
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A modern, type-safe monorepo built with React, Hono, D1, and deployed
          on Cloudflare Pages & Workers.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>⚡ Cloudflare Workers</CardTitle>
            <CardDescription>
              Serverless backend running on the edge
            </CardDescription>
          </CardHeader>
          <CardContent>
            Backend powered by Hono framework with full type safety through RPC
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🗄️ D1 Database</CardTitle>
            <CardDescription>SQLite at the edge</CardDescription>
          </CardHeader>
          <CardContent>
            Serverless SQL database with Drizzle ORM for type-safe queries
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚛️ React + Vite</CardTitle>
            <CardDescription>Modern frontend stack</CardDescription>
          </CardHeader>
          <CardContent>
            Fast development with TanStack Router, Query, and Tailwind CSS
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>API Connection Test</CardTitle>
          <CardDescription>
            Testing end-to-end type-safe connection to the backend
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="text-center text-muted-foreground">
              Loading from API...
            </div>
          )}
          {error && (
            <div className="text-center text-destructive">
              Error: {error.message}
            </div>
          )}
          {data && (
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <p className="font-mono text-sm">
                  {JSON.stringify(data, null, 2)}
                </p>
              </div>
              {data.success && (
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    ✓ Backend connection successful!
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {data.message}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <Button asChild size="lg">
          <a href="/users">View Demo Users</a>
        </Button>
      </div>
    </div>
  );
}

