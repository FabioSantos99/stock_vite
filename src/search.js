
const searchInput = document.querySelector("#search-input");

export const getSearchProducts = (search) => {
      const products = document.querySelectorAll(".prod");

      products.forEach((prod) => {
            let prodTitle = prod.querySelector("td").innerText.toLowerCase();

            const normalizedSearch = search.toLowerCase();

            prod.style.display = "";

            if (!prodTitle.includes(normalizedSearch)) {
                  prod.style.display = "none";
            }
      })
}

searchInput.addEventListener("keyup", (e) => {
      const search = e.target.value;
      getSearchProducts(search);
})