import { putProducts } from "./addProducts";
import { getProductsLocalStorage } from "./savings";
getProductsLocalStorage

export const loadProducts = () => {
      const products = getProductsLocalStorage().forEach((prod) => {
          putProducts(prod.nameInput, prod.priceInput, prod.quantityInput, prod.typePdtInput, 0);
      });

      return products;
  }