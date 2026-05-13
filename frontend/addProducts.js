import { saveProduct } from "./api.js";

const names = document.querySelector("#name");
const price = document.querySelector("#price");
const quantity = document.querySelector("#quantity");
const typePdt = document.querySelector("#typePdt");
const pdtList = document.querySelector("#product-list");
const stockForm = document.querySelector("#stock-form");

const isValidPrice = (v) => !isNaN(parseFloat(v)) && isFinite(v) && parseFloat(v) >= 0;
const isValidQuantity = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

// Functions
export const putProducts = (name, price, quantity, type, id = null) => {
      
      const product = document.createElement('tr');
      product.classList.add("prod", type);
      if (id) product.dataset.id = id;

      ["name:" + name, price, quantity, type].forEach((_, i) => {
            // evita reutilizar o parâmetro shadowed 'price'
      });

      const cells = [name, price, quantity, type];
      cells.forEach((val) => {
            const td = document.createElement('td');
            td.textContent = val;
            product.appendChild(td);
      });

      const td1 = document.createElement("td");
      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.classList.add("edit-item");
      editBtn.textContent = "Edit";
      td1.appendChild(editBtn);
      product.appendChild(td1);

      const td2 = document.createElement("td");
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.classList.add("delete-item");
      deleteBtn.textContent = "Delete";
      td2.appendChild(deleteBtn);
      product.appendChild(td2);

      pdtList.appendChild(product);
}

stockForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameVal = names.value.trim();
      const priceVal = price.value.trim();
      const quantityVal = quantity.value.trim();
      const typeVal = typePdt.value;
      
      if(!nameVal) return alert("Por favor! Digite um nome de produto válido");
      if(!isValidPrice(priceVal)) return alert("Por favor! Digite um preço válido");
      if(!isValidPrice(quantityVal)) return alert("Por favor! Digite um apenas numeros");
      if(!typeVal) return alert("Por favor! Selecione um tipo de produto");

      const formatPrice = parseFloat(priceVal).toFixed(2);

      try {
            const saved = await saveProduct({
                  name: nameVal,
                  price: priceVal,
                  quantity: quantityVal,
                  type: typeVal,
            });
      putProducts(saved.name, saved.price, saved.quantity, saved.type, saved.id);

      names.value = "";
      price.value = "";
      quantity.value = "";
      typePdt.value = "";

      } catch {
            alert("Erro ao salvar produto. Verifique se o servidor está rodando.")
      }
});