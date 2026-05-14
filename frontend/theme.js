const toggle = document.querySelector("#theme-toggle");
const icon = toggle.querySelector("i");

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

toggle.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next)
    localStorage.setItem("theme", next);
});

function applyTheme(theme) {
    
    if (theme === "light") {
        
        document.documentElement.dataset.theme = "light";
        icon.className = "bi bi-moon";
        toggle.title = "Switch to dark";

    } else {

        delete document.documentElement.dataset.theme;
        icon.className = "bi bi-sun";
        toggle.title = "Switch to light";
    }
}
