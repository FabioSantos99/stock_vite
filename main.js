import { loadProducts } from "./src/loadProducts";
import { filterProducts } from "./src/filter";
import { getSearchProducts } from "./src/search";
import { editAndSaveProduct } from "./src/editProd";
import { exportData } from "./src/exports";

   
loadProducts();
filterProducts();
getSearchProducts();
editAndSaveProduct();
exportData();