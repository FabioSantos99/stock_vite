export const saveLocalStorageProduct = (prod) => {
      const products = getProductsLocalStorage();
      products.push(prod)
      localStorage.setItem("products", JSON.stringify(products));
}

//Local Storage
export const getProductsLocalStorage = () => {
      
      const storedProducts = localStorage.getItem("products");
      return storedProducts ? JSON.parse(storedProducts) : [];
}

export const removeLocalStorageProduct = (productName) => {

      const products = getProductsLocalStorage();
      const filteredProds = products.filter((prod) => prod.nameInput !== productName);

      localStorage.setItem("products", JSON.stringify(filteredProds))
}

const sanitizeCsvValue = (value) => {
      const str = String(value ?? "");
      if(str.includes(",") || str.includes("\n") || str.includes('"')) {
            return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
}


// Exportar Dados
const exportBtn = document.querySelector("#export");

export function exportData() {
      const notes = getProductsLocalStorage();

      const csvString = [
            ["Name", "Price", "Quantity", "Type"],
            ...notes.map((prod) => 
            [
            prod.nameInput, 
            prod.priceInput, 
            prod.quantityInput, 
            prod.typePdtInput
            ]),
      ]
      .map((row) => row.map(sanitizeCsvValue).join(","))
      .join("\n");

      const element = document.createElement("a");
      element.href = "data:text/csv;charset=utf-8," + encodeURI(csvString);

      element.target = "_blank";
      element.download ="products.csv";
      element.click();
}

exportBtn.addEventListener("click", () => {
      exportData();
})