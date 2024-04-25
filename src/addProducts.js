import { saveLocalStorageProduct } from "./savings";

const names = document.querySelector("#name");
const price = document.querySelector("#price");
const quantity = document.querySelector("#quantity");
const typePdt = document.querySelector("#typePdt");
const allInput = document.querySelectorAll(".prodInput");
const pdtList = document.querySelector("#product-list");
const stockForm = document.querySelector("#stock-form");

// Functions
export const putProducts = (nameInput, priceInput, quantityInput, typePdtInput, save = 1) => {
      
      const product = document.createElement('tr');
      product.classList.add("prod");


      const nameTitle = document.createElement('td');
      nameTitle.innerText = nameInput;
      product.classList.add(`${typePdtInput}`);
      product.appendChild(nameTitle);

      const priceTitle = document.createElement('td');
      priceTitle.innerText = priceInput;
      product.appendChild(priceTitle);

      const quantityTitle = document.createElement('td');
      quantityTitle.innerText = quantityInput;
      product.appendChild(quantityTitle);

      const typeTitle = document.createElement('td');
      typeTitle.innerText = typePdtInput;
      product.appendChild(typeTitle);

      const td1 = document.createElement("td")
      const editBtn = document.createElement("button")
      td1.appendChild(editBtn);
      editBtn.classList.add("edit-item")
      editBtn.innerHTML = 'Edit'
      product.appendChild(td1);

      const td2 = document.createElement("td")
      const deleteBtn = document.createElement("button")
      td2.appendChild(deleteBtn)
      deleteBtn.classList.add("delete-item")
      deleteBtn.innerHTML = 'Delete'
      product.appendChild(td2);

      pdtList.appendChild(product);

      if (save) {
            saveLocalStorageProduct({nameInput, priceInput, quantityInput, typePdtInput,})
      }
}

stockForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = names.value;
      const priceInput = price.value;
      const quantityInput = quantity.value;
      const typePdtInput = typePdt.value;

      const formatPrice = parseFloat(priceInput).toFixed(2);

      if (nameInput && priceInput && quantityInput && typePdtInput) {
            putProducts(nameInput, formatPrice, quantityInput, typePdtInput)
            names.value = "";
            price.value = "";
            quantity.value = "";
            typePdt.value = "";
      }    
});