// ============================================================
// Supabase-backed mods loader
// ============================================================
// 1. Fill in your project URL + anon key below (Supabase dashboard
//    -> Project Settings -> API).
// 2. Create the `mods` table using the SQL in SETUP.md.
// 3. Add rows to the table (via Table Editor or SQL) and every
//    page that includes this file will pick them up automatically.
// ============================================================

const SUPABASE_URL = "https://xyxyjkngfkuaqxzpbyme.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5eHlqa25nZmt1YXF4enBieW1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MDgyMzgsImV4cCI6MjA5OTE4NDIzOH0.jCvs1w9IDp8cRppddVj1Jun2_vS57jayGsClb8aDTGo";

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- icons (matched to the existing hand-drawn SVGs) ----------
const ICONS = {
  minecraft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/></svg>`,
  gd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 4 3 20h18L12 4Z"/></svg>`
};

const GAME_LABEL = { minecraft: "Minecraft", gd: "Geometry Dash" };
const LOADER_LABEL = { neoforge: "NeoForge", forge: "Forge", fabric: "Fabric", quilt: "Quilt" };
const STATUS_LABEL = { released: "Released", beta: "Beta", alpha: "Alpha", indev: "In development" };

function tagsHTML(mod) {
  let html = `<span class="tag ${mod.game === "minecraft" ? "mc" : "gd"}">${GAME_LABEL[mod.game] || mod.game}</span>`;
  if (mod.loader) html += `<span class="tag loader">${LOADER_LABEL[mod.loader] || mod.loader}</span>`;
  if (mod.mc_version) html += `<span class="tag mcver">${mod.mc_version}</span>`;
  return html;
}

function iconHTML(mod) {
  return ICONS[mod.game] || ICONS.minecraft;
}

// ---------- card variants ----------
// variant: "home"     -> thumb + tags + title + desc + download button
// variant: "mods"     -> thumb + tags + title + desc + status badge, with
//                        data-* attrs so the existing filter script on
//                        mods.html keeps working unmodified
// variant: "projects" -> thumb + tags + title + desc + dotted status badge

export function renderModCard(mod, variant = "home") {
  const statusLabel = STATUS_LABEL[mod.status] || mod.status;

  if (variant === "home") {
    const dl = mod.status === "released" && mod.download_url
      ? `<a class="card-dl" href="${mod.download_url}" target="_blank" rel="noopener" style="display:flex;align-items:center;justify-content:center;text-decoration:none;">Download</a>`
      : `<button class="card-dl" disabled>Coming soon</button>`;
    return `
      <div class="card">
        <div class="card-thumb">${iconHTML(mod)}</div>
        <div class="card-body">
          <div class="card-tags">${tagsHTML(mod)}</div>
          <h3>${mod.name}</h3>
          <p>${mod.description || ""}</p>
          ${dl}
        </div>
      </div>`;
  }

  if (variant === "mods") {
    return `
      <div class="card mod"
        data-game="${mod.game || ""}"
        data-loader="${mod.loader || ""}"
        data-version="${mod.mc_version || ""}"
        data-status="${mod.status || ""}">
        <div class="card-thumb">${iconHTML(mod)}</div>
        <div class="card-body">
          <div class="card-tags">${tagsHTML(mod)}</div>
          <h3>${mod.name}</h3>
          <p>${mod.description || ""}</p>
          <span class="status-badge">${statusLabel}</span>
        </div>
      </div>`;
  }

  // "projects"
  return `
    <div class="card">
      <div class="card-thumb">${iconHTML(mod)}</div>
      <div class="card-body">
        <div class="card-tags">${tagsHTML(mod)}</div>
        <h3>${mod.name}</h3>
        <p>${mod.description || ""}</p>
        <span class="status-badge"><span class="dot"></span>${statusLabel}</span>
      </div>
    </div>`;
}

// ---------- data fetching ----------
// Fetches mods from Supabase. Pass { limit, orderBy } as needed.
export async function fetchMods({ limit, orderBy = "sort_order", ascending = true } = {}) {
  try {
    let query = supabase.from("mods").select("*").order(orderBy, { ascending });
    if (limit) query = query.limit(limit);
    const { data, error } = await query;
    if (error) {
      console.error("Supabase returned an error fetching mods:", error);
      return { data: [], error };
    }
    return { data: data || [], error: null };
  } catch (err) {
    // Network failure, bad URL, CORS block, etc. land here
    console.error("Failed to reach Supabase:", err);
    return { data: [], error: err };
  }
}

// ---------- render helper ----------
// container: DOM element to fill
// mods: array of mod rows
// variant: "home" | "mods" | "projects"
// emptyMessage: shown if there are zero mods
export function renderMods(container, mods, variant, emptyMessage = "Nothing here yet — check back soon.", error = null) {
  if (error) {
    container.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;">
      Couldn't load mods (${error.message || "connection error"}). Check the browser console,
      and confirm SUPABASE_URL / SUPABASE_ANON_KEY in js/supabase-mods.js are correct.
    </p>`;
    return;
  }
  if (!mods.length) {
    container.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;">${emptyMessage}</p>`;
    return;
  }
  container.innerHTML = mods.map(mod => renderModCard(mod, variant)).join("");
}
