import { getProductsLocalStorage } from "./savings";

document.addEventListener("DOMContentLoaded", () => {
      const exportBtn = document.querySelector("#export");
      exportBtn.addEventListener("click", () => {
        exportData();
      });
    });
    
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