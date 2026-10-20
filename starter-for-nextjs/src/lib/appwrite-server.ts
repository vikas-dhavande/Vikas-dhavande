/**
 * Server-only Appwrite client.
 * Uses APPWRITE_API_KEY — never send this to the browser.
 * Import only inside Server Components, Route Handlers, or Server Actions.
 */
import { Client, Account, Databases, Users } from "node-appwrite";

const serverClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

export const serverAccount = new Account(serverClient);
export const serverDatabases = new Databases(serverClient);
export const serverUsers = new Users(serverClient);

/**
 * Build a session-scoped server client for a specific user session.
 * Use when you have the session secret from a cookie and want to
 * act on behalf of that user rather than as an admin.
 */
export function createSessionClient(sessionSecret: string) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setSession(sessionSecret);
  return {
    account: new Account(client),
    databases: new Databases(client),
  };
}
