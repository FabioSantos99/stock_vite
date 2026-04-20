const searchInput = document.querySelector("#search-input");

export const getSearchProducts = (search) => {
      const products = document.querySelectorAll(".prod");
      const normalizedSearch = search.toLowerCase().trim();

      products.forEach((prod) => {
            const prodTitle = prod.querySelector("td").textContent.toLowerCase();
            prod.style.display = prodTitle.includes(normalizedSearch) ? "" : "none";
      });
};

searchInput.addEventListener("keyup", (e) => {
      getSearchProducts(e.target.value);
})