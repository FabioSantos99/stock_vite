import { logout } from "./api.js";

const token    = localStorage.getItem("token");
const role     = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!token) {
  window.location.href = "login.html";
} else {
  // Executa após o DOM carregar completamente
  document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.querySelector("#user-info");
    if (userInfo) {
      userInfo.textContent = `${username} (${role})`;
    }

    if (role !== "admin") {
      const style = document.createElement("style");
      style.textContent = ".delete-item { display: none !important; }";
      document.head.appendChild(style);
    }

    const logoutBtn = document.querySelector("#logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  });
}