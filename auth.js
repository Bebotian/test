// ============================================================
// Simple username + password accounts, built on Supabase Auth
// ============================================================
// Supabase Auth is email-based under the hood, so each username is
// mapped to a fake internal address (e.g. "steve" -> "steve@users.bebotian.local").
// The user only ever sees "username" — never told about the email trick.
//
// IMPORTANT one-time setup in the Supabase dashboard:
//   Authentication -> Providers -> Email -> turn OFF "Confirm email"
//   (there's no real inbox behind these addresses, so confirmation
//   emails would never be receivable — leaving it on locks everyone out).
// ============================================================

import { supabase } from "./supabase-client.js";

const FAKE_EMAIL_DOMAIN = "users.bebotian.local";

function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@${FAKE_EMAIL_DOMAIN}`;
}

function friendlyError(error) {
  if (!error) return "";
  const msg = error.message || String(error);
  if (/already registered|already exists/i.test(msg)) return "That username is already taken.";
  if (/invalid login credentials/i.test(msg)) return "Wrong username or password.";
  if (/password should be at least/i.test(msg)) return msg.replace(/email/gi, "username").replace(/Password/, "Password");
  if (/unable to validate email/i.test(msg) || /invalid email/i.test(msg)) return "Usernames can only contain letters, numbers, dots, and underscores.";
  return msg.replace(/email/gi, "username");
}

export function isValidUsername(username) {
  return /^[a-zA-Z0-9_.]{3,20}$/.test(username);
}

export async function signUp(username, password) {
  if (!isValidUsername(username)) {
    return { user: null, error: { message: "Usernames must be 3-20 characters: letters, numbers, dots, or underscores only." } };
  }
  const { data, error } = await supabase.auth.signUp({
    email: usernameToEmail(username),
    password,
    options: { data: { username } }
  });
  if (error) return { user: null, error: { message: friendlyError(error) } };
  return { user: data.user, error: null };
}

export async function signIn(username, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password
  });
  if (error) return { user: null, error: { message: friendlyError(error) } };
  return { user: data.user, error: null };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

export function getUsername(user) {
  if (!user) return "";
  return user.user_metadata?.username || user.email?.split("@")[0] || "";
}
