import { loadProducts } from "./loadProducts.js";
import "./filter.js"
import "./search.js";
import "./editProducts.js";
import "./importProducts.js";

// Aguarda o DOM e o authGuard terminarem antes de carregar
window.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");

    if (token) {
        await loadProducts();
    }
})
