import { QueryClient, isServer } from '@tanstack/react-query';

/**
 * Creates a QueryClient configured for this application.
 * Server-side: Creates a new instance per request (no caching across requests).
 * Client-side: Uses a singleton for the browser session.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

/**
 * Returns a QueryClient instance.
 * - On the server: Creates a new client per request.
 * - On the client: Returns a singleton instance.
 */
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This helps avoid re-creating the client between re-renders
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
