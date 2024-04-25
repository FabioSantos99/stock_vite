import { removeLocalStorageProduct, getProductsLocalStorage } from "./savings";

const editTable = document.querySelector("#edit-table");
const editName = document.querySelector("#edit-name");
const editPrice = document.querySelector("#edit-price");
const editQuantiy = document.querySelector("#edit-quantity");
const editType = document.querySelector("#edit-type");
const cancelBtnEdit = document.querySelector("#cancel-edit-btn");
let editingInput = null;
let oldValues;

export const editAndSaveProduct = (oldName, newName, newPrice, newQuantity, newType) => {
      const products = getProductsLocalStorage();

      const editedProductIndex = products.findIndex((prod) => prod.nameInput === oldName);

      if (editedProductIndex !== -1) {
            products[editedProductIndex] = {
                  nameInput: newName,
                  priceInput: newPrice,
                  quantityInput: newQuantity,
                  typePdtInput: newType,
            }

            localStorage.setItem("products", JSON.stringify(products));
      }
}

document.addEventListener("click", (e) => {
      
      const prodList = e.target.closest(".prod")

      if(e.target.classList.contains("edit-item")) {
            editingInput = prodList;
            const currentName = prodList.querySelector("td:nth-child(1)").innerText.trim();

            const currentPrice = prodList.querySelector("td:nth-child(2)").innerText.trim();

            const currentQuantity = prodList.querySelector("td:nth-child(3)").innerText.trim();

            const currentType = prodList.querySelector("td:nth-child(4)").innerText.trim();

            oldValues = currentName;
            editName.value = currentName;
            editPrice.value = currentPrice;
            editQuantiy.value = currentQuantity;
            editType.value = currentType;
            editTable.style.display = 'block';

      } else if (e.target.classList.contains("delete-item")) {
            const productName = prodList.querySelector("td:nth-child(1)").textContent;

            // Remover Produto
            removeLocalStorageProduct(productName);
            prodList.remove();
      }
})


cancelBtnEdit.addEventListener("click", () => {
      // Oculta a tabela de edição
      editTable.style.display = "none";
  });

editTable.addEventListener("submit", (e) => {
      e.preventDefault();

      const editedName = editName.value;
      const editedPrice = editPrice.value;
      const editedQuantity = editQuantiy.value;
      const editedType = editType.value;

      const formatEditPrice = parseFloat(editedPrice).toFixed(2);


      if (editedName && editedPrice && editedQuantity && editedType && editingInput) {
            // Update the text in the original item
            editingInput.querySelector("td:nth-child(1)").textContent = editedName;
            editingInput.querySelector("td:nth-child(2)").textContent = formatEditPrice;
            editingInput.querySelector("td:nth-child(3)").textContent = editedQuantity;
            editingInput.querySelector("td:nth-child(4)").textContent = editedType;

            const oldName = oldValues;
            editAndSaveProduct(oldName, editedName, editedPrice, editedQuantity, editedType);

            // Clear the editing variable and hide the edit form
            editingInput = null;
            editTable.style.display = "none";
      }
});