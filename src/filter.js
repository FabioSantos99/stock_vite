const filterBtn = document.querySelector("#filter-select");

export const filterProducts = (filterValue) => {
      const products = document.querySelectorAll(".prod");

      switch(filterValue) {
            case "all":
                  products.forEach((prod) => prod.style.display = "")
                  break;
            case "phone":
                  products.forEach((prod) => prod.classList.contains("phone") ? (prod.style.display = "") : (prod.style.display = "none"));
                  break;
            case "console":
                  products.forEach((prod) => prod.classList.contains("console") ? (prod.style.display = "") : (prod.style.display = "none"));
                  break;
            case "computer":
                  products.forEach((prod) => prod.classList.contains("computer") ? (prod.style.display = "") : (prod.style.display = "none"));
                  break;
            case "tv":
                  products.forEach((prod) => prod.classList.contains("tv") ? (prod.style.display = "") : (prod.style.display = "none"));
                  break;
      }
}

filterBtn.addEventListener("change", (e) => {
      const filterValue = e.target.value;

      filterProducts(filterValue);
})