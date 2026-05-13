import { putProducts } from "./addProducts.js";
import { getAllProducts } from "./api.js";

export const loadProducts = async () => {

    try {
        const products = await getAllProducts();
        products.forEach((p) => {
            putProducts(p.name, p.price, p.quantity, p.type, p.id);
        })
    } catch (err) {
       console.error(err);
    }
}