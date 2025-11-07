import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="min-h-screen bg-background">
        <nav className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-bold">
                  Cloudflare Fullstack
                </Link>
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    activeProps={{
                      className: 'text-primary',
                    }}
                  >
                    Home
                  </Link>
                  <Link
                    to="/users"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    activeProps={{
                      className: 'text-primary',
                    }}
                  >
                    Users
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          <Outlet />
        </main>
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

