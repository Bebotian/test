import { getCurrentUser, getUsername, signOut } from "./auth.js";

const widget = document.getElementById("authWidget");
if (widget) {
  const user = await getCurrentUser();

  if (user) {
    const username = getUsername(user);
    const letter = (username[0] || "?").toUpperCase();

    widget.innerHTML = `
      <div class="account-menu">
        <button class="avatar" id="avatarBtn" aria-label="Account menu" title="${username}">
          <span>${letter}</span>
        </button>
        <div class="account-dropdown" id="accountDropdown">
          <div class="account-dropdown-name">${username}</div>
          <button class="account-dropdown-logout" id="logoutBtn">Log out</button>
        </div>
      </div>`;

    const avatarBtn = document.getElementById("avatarBtn");
    const dropdown = document.getElementById("accountDropdown");
    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", () => dropdown.classList.remove("open"));

    document.getElementById("logoutBtn").addEventListener("click", async () => {
      await signOut();
      window.location.href = "index.html";
    });
  } else {
    widget.innerHTML = `
      <a href="account.html" class="btn btn-ghost auth-btn">Log in</a>
      <a href="account.html?mode=signup" class="btn btn-primary auth-btn">Sign up</a>`;
  }
}
