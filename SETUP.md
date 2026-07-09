# Hooking the site up to Supabase

## 1. Create a Supabase project
Go to [supabase.com](https://supabase.com), create a project, then open
**Project Settings → API** and copy:
- **Project URL**
- **anon public** key

## 2. Add your credentials
Open `js/supabase-mods.js` and fill in the top two constants:

```js
const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
```

The anon key is safe to expose in client-side code — it only allows what
your Row Level Security policies permit (see below).

## 3. Create the `mods` table
In the Supabase dashboard, open the **SQL Editor** and run:

```sql
create table mods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  game text not null check (game in ('minecraft', 'gd')),
  loader text check (loader in ('neoforge', 'forge', 'fabric', 'quilt')),
  mc_version text,
  status text not null default 'indev'
    check (status in ('released', 'beta', 'alpha', 'indev')),
  download_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Allow anyone to read mods (this is public site content)
alter table mods enable row level security;

create policy "Public read access"
  on mods for select
  using (true);
```

By default there's no insert/update/delete policy, so the public anon key
can only *read* rows — you add/edit mods from the Supabase dashboard (or
your own authenticated tooling), and the site just displays them.

## 4. Seed it with your current mods

```sql
insert into mods (name, description, game, loader, mc_version, status, sort_order)
values
  ('Wildreach',
   'Wildreach expands your world with new biomes, unique biomes, and scattered structures to discover, bringing fresh life and exploration to every journey.',
   'minecraft', 'neoforge', '26.1.2', 'indev', 1),
  ('GDmenu',
   'A short description of what GDmenu does will go here once it''s ready to share.',
   'gd', null, null, 'indev', 2);
```

## 5. That's it
- `index.html` shows the 2 most recent mods (by `sort_order`) with a
  download button (enabled automatically once `status = 'released'` and
  `download_url` is set).
- `mods.html` shows every mod and keeps the existing game/loader/version/status
  filters and grid/list toggle — they now filter the Supabase data instead of
  static cards.
- `projects.html` shows everything that isn't `released` yet.

To add a new mod later, just insert a new row in the `mods` table — no HTML
editing required. To mark one as shipped, set `status = 'released'` and fill
in `download_url`.

### Optional: changelog too
`changelog.html` still has its old hand-written "empty state." If you'd like
that pulled from Supabase as well (e.g. a `changelog_entries` table tied to
each mod), just ask — happy to wire that up the same way.
