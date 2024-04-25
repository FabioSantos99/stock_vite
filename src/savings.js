export const saveLocalStorageProduct = (prod) => {
      const products = getProductsLocalStorage();
      products.push(prod)
      localStorage.setItem("products", JSON.stringify(products));
}

//Local Storage
export const getProductsLocalStorage = () => {
      
      const storedProducts = localStorage.getItem("products");
      const products = storedProducts ? JSON.parse(storedProducts) : [];
    
      return products;
}

export const removeLocalStorageProduct = (productName) => {
      const products = getProductsLocalStorage();

      const filteredProds = products.filter((prod) => prod.nameInput !== productName);

      localStorage.setItem("products", JSON.stringify(filteredProds))
}