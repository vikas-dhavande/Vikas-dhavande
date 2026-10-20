import { Client, Account, Databases, ID } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

/**
 * Sign in with email and password.
 */
async function signInWithEmail(email, password) {
  return account.createEmailPasswordSession(email, password);
}

/**
 * Sign up with name, email, password — then immediately create a session.
 */
async function signUpWithEmail(name, email, password) {
  await account.create(ID.unique(), email, password, name);
  return account.createEmailPasswordSession(email, password);
}

/**
 * OAuth sign-in with GitHub.
 * Redirects to GitHub and back to the app origin on success/failure.
 */
function signInWithGithub() {
  const origin = window.location.origin;
  account.createOAuth2Session("github", origin, origin);
}

/**
 * OAuth sign-in with Google.
 * Redirects to Google and back to the app origin on success/failure.
 */
function signInWithGoogle() {
  const origin = window.location.origin;
  account.createOAuth2Session("google", origin, origin);
}

export {
  client,
  account,
  databases,
  signInWithEmail,
  signUpWithEmail,
  signInWithGithub,
  signInWithGoogle,
};
