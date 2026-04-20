import { saveLocalStorageProduct } from "./savings";

const names = document.querySelector("#name");
const price = document.querySelector("#price");
const quantity = document.querySelector("#quantity");
const typePdt = document.querySelector("#typePdt");
const pdtList = document.querySelector("#product-list");
const stockForm = document.querySelector("#stock-form");

const isValidPrice = (value) => !isNaN(parseFloat(value)) && isFinite(value) && parseFloat(value) >= 0;
const isValidQuantity = (value) => Number.isInteger(Number(value)) && Number(value) >= 0;

// Functions
export const putProducts = (nameInput, priceInput, quantityInput, typePdtInput, save = 1) => {
      
      const product = document.createElement('tr');
      product.classList.add("prod", `${typePdtInput}`);


      const nameTitle = document.createElement('td');
      nameTitle.textContent = nameInput;
      product.appendChild(nameTitle);

      const priceTitle = document.createElement('td');
      priceTitle.textContent = priceInput;
      product.appendChild(priceTitle);

      const quantityTitle = document.createElement('td');
      quantityTitle.textContent = quantityInput;
      product.appendChild(quantityTitle);

      const typeTitle = document.createElement('td');
      typeTitle.textContent = typePdtInput;
      product.appendChild(typeTitle);

      const td1 = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.classList.add("edit-item");
      editBtn.innerHTML = 'Edit'
      td1.appendChild(editBtn);
      product.appendChild(td1);

      const td2 = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.classList.add("delete-item");
      deleteBtn.innerHTML = 'Delete';
      td2.appendChild(deleteBtn);
      product.appendChild(td2);

      pdtList.appendChild(product);

      if (save) {
            saveLocalStorageProduct({nameInput, priceInput, quantityInput, typePdtInput,})
      }
}

stockForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = names.value.trim();
      const priceInput = price.value.trim();
      const quantityInput = quantity.value.trim();
      const typePdtInput = typePdt.value;
      
      if(!nameInput) return alert("Por favor! Digite um nome de produto válido");
      if(!isValidPrice(priceInput)) return alert("Por favor! Digite um preço válido");
      if(!isValidPrice(quantityInput)) return alert("Por favor! Digite um apenas numeros");
      if(!typePdtInput) return alert("Por favor! Selecione um tipo de produto");

      const formatPrice = parseFloat(priceInput).toFixed(2);

      putProducts(nameInput, formatPrice, quantityInput, typePdtInput);

      name.value= "";
      price.value = "";
      quantity.value = "";
      typePdt.value = "";

});