import { removeLocalStorageProduct, getProductsLocalStorage } from "./savings";

const editTable = document.querySelector("#edit-table");
const editName = document.querySelector("#edit-name");
const editPrice = document.querySelector("#edit-price");
const editQuantiy = document.querySelector("#edit-quantity");
const editType = document.querySelector("#edit-type");
const cancelBtnEdit = document.querySelector("#cancel-edit-btn");
const editForm = editTable.querySelector("form")

let editingRow = null;
let oldName = null;

const isValidePrice = (value) => !isNaN(parseFloat(value)) && isFinite(value) & parseFloat(value) >= 0;
const isValidQuantity = (value) => Number.isInteger(Number(value)) && Number(value) >= 0;

export const editAndSaveProduct = (oldNameVal, newName, newPrice, newQuantity, newType) => {

      const products = getProductsLocalStorage();

      const index = products.findIndex((prod) => prod.nameInput === oldNameVal);

      if (index !== -1) {

            products[index] = {
                  nameInput: newName,
                  priceInput: newPrice,
                  quantityInput: newQuantity,
                  typePdtInput: newType,
            }

            localStorage.setItem("products", JSON.stringify(products));
      }
};

const openEditTable = () => {
      editTable.style.display = "block";
}

const closeEditTable = () => {
      editTable.style.display = "none";
      editingRow = null;
      oldName = null;
}


document.addEventListener("click", (e) => {
      
      const prodRow = e.target.closest(".prod")

      if(e.target.classList.contains("edit-item") && prodRow) {
            editingRow = prodRow;

            const currentName = prodRow.querySelector("td:nth-child(1)").innerText.trim();

            const currentPrice = prodRow.querySelector("td:nth-child(2)").innerText.trim();

            const currentQuantity = prodRow.querySelector("td:nth-child(3)").innerText.trim();

            const currentType = prodRow.querySelector("td:nth-child(4)").innerText.trim();

            oldName = currentName;
            editName.value = currentName;
            editPrice.value = currentPrice;
            editQuantiy.value = currentQuantity;
            editType.value = currentType;

            openEditTable();

      } else if (e.target.classList.contains("delete-item") && prodRow) {
            const productName = prodRow.querySelector("td:nth-child(1)").textContent.trim();

            // Remove Product
            removeLocalStorageProduct(productName);
            prodRow.remove();
      }
});


cancelBtnEdit.addEventListener("click", () => {
      // hidden edit table
      closeEditTable()
  });

editTable.addEventListener("submit", (e) => {
      e.preventDefault();

      const editedName = editName.value.trim();
      const editedPrice = editPrice.value.trim();
      const editedQuantity = editQuantiy.value.trim();
      const editedType = editType.value;

      if (!editedName) return alert("Por favor. Digite o nome do produto");

      if (!isValidePrice(editedPrice)) return alert("Por favor. Digite o preço do produto");

      if (!isValidQuantity(editedQuantity)) return alert("Por favor. Digite a quantidade do produto");

      if (!editedType) return alert("Por favor. Selecione o tipo do produto")


      const formatEditPrice = parseFloat(editedPrice).toFixed(2);


      
            // Update the text in the original item
            editingRow.querySelector("td:nth-child(1)").textContent = editedName;

            editingRow.querySelector("td:nth-child(2)").textContent = formatEditPrice;

            editingRow.querySelector("td:nth-child(3)").textContent = editedQuantity;

            editingRow.querySelector("td:nth-child(4)").textContent = editedType;

            editingRow.className = `prod ${editedType}`;

            editAndSaveProduct(oldName, editedName, formatEditPrice, editedQuantity, editedType);

           closeEditTable();
      
});