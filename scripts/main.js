import { Product } from "./products.js";
import { ProductManager } from "./productsManager.js";
 
document.getElementById('search-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search-product');
    const searchTerm = searchInput.value;
    const filteredProducts = productManager.searchProduct(searchTerm);
 
    updateInventoryTable(filteredProducts);
});
 
const productManager = new ProductManager();
 
productManager.loadFromLocalStorage();
 
updateInventoryTable();
 
document.getElementById('product-form-events').
    addEventListener('submit', function (event) {
        event.preventDefault();
 
        const productName = document.getElementById('product-name').value;
        const productQuantity = parseInt(document.getElementById('product-quantity').value);
        const productPrice = parseFloat(document.getElementById('product-price').value);
 
        const newProduct = new Product(Date.now(), productName, productQuantity, productPrice);
 
        console.log(newProduct);
 
        productManager.addProduct(newProduct);
 
        productManager.saveToLocalStorage();
 
        this.reset();
 
        updateInventoryTable();
        productManager.loadFromLocalStorage();
    });
 
function updateInventoryTable(products = productManager.listProducts()) {
    const tableBody = document.getElementById('body-table');
    tableBody.innerHTML = '';
 
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.nombre}</td>
            <td>${product.cantidad}</td>
            <td>${product.precio}</td>
            <td>
            <button class="edit-button">Editar</button>
            <button class="delete-button">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
 
        const editButton = row.querySelector(".edit-button");
        const deleteButton = row.querySelector('.delete-button');
 
        deleteButton.addEventListener('click', () => {
            productManager.deleteProductById(product.id);
 
            removeFromLocalStorage(product.id);
            updateInventoryTable();
        });
 
        function removeFromLocalStorage(productId) {
            const storedProducts = Object.keys(localStorage).map(key => {
                const data = JSON.parse(localStorage.getItem(key));
                return new Product(data.id, data.nombre, data.cantidad, data.precio);
            });
 
            const index = storedProducts.findIndex(product => product.id === productId);
 
            if (index !== -1) {
                storedProducts.splice(index, 1);
                localStorage.removeItem(productId);
            }
        }
 
        editButton.addEventListener('click', () => {
            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirmar';
            confirmButton.classList.add('confirm-button');
 
            row.querySelector('.edit-button').replaceWith(confirmButton);
 
            confirmButton.addEventListener('click', () => {
                const productName = document.getElementById('product-name').value;
                const productQuantity = parseInt(document.getElementById('product-quantity').value);
                const productPrice = parseFloat(document.getElementById('product-price').value);
 
                if (productName !== null && productQuantity !== null && productPrice !== null) {
                    const editedProduct = new Product(product.id, productName, parseInt(productQuantity), parseFloat(productPrice));
 
                    productManager.updateProductById(product.id, editedProduct);
 
                    console.log(editedProduct);
 
                    productManager.saveToLocalStorage();
 
                    location.reload();
                }
 
                confirmButton.replaceWith(editButton);
            });
        });
    });
}