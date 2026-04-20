const filterBtn = document.querySelector("#filter-select");

export const filterProducts = (filterValue) => {
      const products = document.querySelectorAll(".prod");

      products.forEach((prod) => {
            const show = filterValue === "all" || prod.classList.contains(filterValue);
            prod.style.display = show ? "" : "none";
      });    
};

filterBtn.addEventListener("change", (e) => {
      filterProducts(e.target.value);
});