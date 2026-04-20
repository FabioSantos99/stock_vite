import { putProducts } from "./addProducts";
import { getProductsLocalStorage } from "./savings";

export const loadProducts = () => {
    getProductsLocalStorage().forEach((prod) => {
          putProducts(prod.nameInput, prod.priceInput, prod.quantityInput, prod.typePdtInput, 0);
      });
}