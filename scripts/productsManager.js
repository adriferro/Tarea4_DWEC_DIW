import { Product } from "./products.js";

export class ProductManager {
    #products;

    constructor() {
        this.#products = [];
    }
    listProducts() {
        return this.#products;
    }
    addProduct(product) {
        this.#products.push(product);
    }
    updateProductById(id, updateProduct) {
        const index = this.#products.findIndex(product => product.id === id);

        if (index !== -1) {
            this.#products[index] = updateProduct;
        }

    }

    deleteProductById(id) {
        const index = this.#products.findIndex(product => product.id === id);

        if (index !== -1) {
            this.#products.splice(index, 1);
        }
    }

    searchProduct(productName) {
        const searchTerm = productName.trim().toLowerCase();
        const products = this.#products;

        if (searchTerm === "") {
            return products;
        }

        const index = products.findIndex(product => product.nombre.toLowerCase().includes(searchTerm));

        if (index === -1) {
            alert('Ningún producto encontrado');
            return [];
        }

        return [products[index]];
    }


    showProducts() {
        for (const product of this.#products) {
            console.log(`ID: ${product.id}, Nombre: ${product.nombre}, Cantidad: ${product.cantidad}, Precio: ${product.precio}`);
        }
    }

    saveToLocalStorage() {
        this.#products.forEach(product => {
            localStorage.setItem(product.id, JSON.stringify(product.toJSON()));
        });
    }

    loadFromLocalStorage() {
        const products = Object.keys(localStorage).map(key => {
            const data = JSON.parse(localStorage.getItem(key));
            return new Product(data.id, data.nombre, data.cantidad, data.precio);
        });
        this.#products = products;
    }
    get products(){
        return this.#products;
    }

    set products(value){
        this.#products = value;
    }

}