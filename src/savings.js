export const saveLocalStorageProduct = (prod) => {
      const products = getProductsLocalStorage();
      products.push(prod)
      localStorage.setItem("products", JSON.stringify(products));
}

//Local Storage
export const getProductsLocalStorage = () => {
      
      const storedProducts = localStorage.getItem("products");
      const products = storedProducts ? JSON.parse(storedProducts) : [];
    
      return products;
}

export const removeLocalStorageProduct = (productName) => {
      const products = getProductsLocalStorage();

      const filteredProds = products.filter((prod) => prod.nameInput !== productName);

      localStorage.setItem("products", JSON.stringify(filteredProds))
}


// Exportar Dados
const exportBtn = document.querySelector("#export");

export function exportData() {
      const notes = getProductsLocalStorage();

      const csvString = [
            ["Name", "Price", "Quantity", "Type"],
            ...notes.map((prod) => [prod.nameInput, prod.priceInput, prod.quantityInput, prod.typePdtInput]),
      ].map((e) => e.join(","))
      .join("\n");
      const element = document.createElement("a")
      element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

      element.target = "blank";
      element.download ="products.csv";

      element.click();
}

exportBtn.addEventListener("click", () => {
      exportData();
})