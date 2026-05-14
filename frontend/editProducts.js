import { removeProduct, updateProduct } from "./api.js";

const editTable = document.querySelector("#edit-table");
const editName = document.querySelector("#edit-name");
const editPrice = document.querySelector("#edit-price");
const editQuantity = document.querySelector("#edit-quantity");
const editType = document.querySelector("#edit-type");
const cancelBtnEdit = document.querySelector("#cancel-edit-btn");
const editForm = editTable.querySelector("form")

let editingRow = null;
let editingId = null;

const isValidePrice = (v) => !isNaN(parseFloat(v)) && isFinite(v) & parseFloat(v) >= 0;
const isValidQuantity = (v) => Number.isInteger(Number(v)) && Number(v) >= 0;

const openEdit = () => { editTable.style.display = "block"; };
const closeEdit = () => {
      editTable.style.display = "none";
      editingRow = null;
      editingId = null;
};


document.addEventListener("click", async (e) => {
      
      const row = e.target.closest(".prod")

      if(e.target.classList.contains("edit-item") && row) {
            editingRow = row;
            editingId = row.dataset.id;

            editName.value = row.querySelector("td:nth-child(1)").textContent.trim();
            editPrice.value = row.querySelector("td:nth-child(2)").textContent.trim();
            editQuantity.value = row.querySelector("td:nth-child(3)").textContent.trim();
            editType.value = row.querySelector("td:nth-child(4)").textContent.trim();

            openEdit();

      } else if (e.target.classList.contains("delete-item") && row) {
            try {
                  await removeProduct(row.dataset.id);
                  row.remove();
            } catch {
                  alert("Erro ao remover produto. Verifique se o servidor está rodando.");
            }
      }
});

cancelBtnEdit.addEventListener("click", closeEdit);

editForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = editName.value.trim();
      const price = editPrice.value.trim();
      const quantity = editQuantity.value.trim();
      const type = editType.value;

      if (!name) return alert("Por favor. Digite o nome do produto");

      if (!isValidePrice(price)) return alert("Por favor. Digite o preço do produto");

      if (!isValidQuantity(quantity)) return alert("Por favor. Digite a quantidade do produto");

      if (!type) return alert("Por favor. Selecione o tipo do produto")
      
      if (!editingRow || !editingId) return;

      const formatPrice = parseFloat(price).toFixed(2);

      try {
            await updateProduct(editingId, { name, price: formatPrice, quantity, type })

               // Update the text in the original item
            editingRow.querySelector("td:nth-child(1)").textContent = name;
            editingRow.querySelector("td:nth-child(2)").textContent = formatPrice;
            editingRow.querySelector("td:nth-child(3)").textContent = quantity;
            editingRow.querySelector("td:nth-child(4)").textContent = type;
            editingRow.className = `prod ${type}`;

           closeEdit();
      } catch {
            alert("Erro ao atualizar produto. Verifique se o servidor está rodando.")
      }  
});