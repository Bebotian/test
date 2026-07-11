
## 6. Account system (username + password)

The site now has a simple account system, layered on top of Supabase's
built-in Auth (so passwords are hashed/handled by Supabase, not homemade).

### One-time Supabase dashboard setting
Supabase Auth is email-based internally, so each username is mapped to a
fake address behind the scenes (e.g. `steve` → `steve@users.bebotian.local`).
Because there's no real inbox behind it, you must turn off email
confirmation or nobody will be able to finish signing up:

**Authentication → Providers → Email → turn OFF "Confirm email"**

### Credentials moved
Your Supabase URL/anon key now live in **`js/supabase-client.js`** instead
of `js/supabase-mods.js`. If you'd already filled in your real project URL
and key in the old file, copy those same two values into
`js/supabase-client.js` — I couldn't see what you'd entered from my end, so
this file ships with the placeholder values and needs your real ones pasted
back in.

### What's included
- `account.html` — combined log in / sign up form (username + password only)
- Every page's header now has an account widget:
  - Logged out → "Log in" / "Sign up" buttons
  - Logged in → a circular gray avatar with the first letter of the
    username rendered in the site's rainbow gradient; click it for a
    dropdown with the username and a "Log out" button
- `js/auth.js` — signUp / signIn / signOut / getCurrentUser helpers
- `js/auth-widget.js` — renders the header widget on every page

### Known limitation
Because usernames don't have a real email attached, there's no password
reset flow — if someone forgets their password, they'll need a new
username. If you want real password recovery later, that requires
collecting an actual email at signup, which is a bigger change — happy to
add it if you want it.
