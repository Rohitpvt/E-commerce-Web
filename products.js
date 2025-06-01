let productCount = 0;
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const productData = await response.json();
        displayProducts(productData);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
function displayProducts(productData) {
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = '';

    productData.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.description}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.category}</td>
            <td><img src="${product.image_url}" alt="${product.name}"></td>
        `;
        tableBody.appendChild(row);
    });
}
async function addProduct(event) {
    event.preventDefault();
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = parseFloat(document.getElementById('productPrice').value);
    const productCategory = document.getElementById('productCategory').value;
    const productBrand = document.getElementById('productBrand').value;
    const productImageUrl = document.getElementById('productImage').value;
    const newProduct = {
        name: productName,
        description: productDescription,
        price: productPrice,
        image_url: productImageUrl,
        brand: productBrand,
        category: productCategory,
    };
    try {
        const response = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });

        if (response.ok) {
            console.log("Product added successfully!");

            fetchProducts();

            document.getElementById('productForm').reset();
        } else {
            console.error("Failed to add product.");
        }
    } catch (error) {
        console.error("Error adding product:", error);
    }
}
window.onload = fetchProducts;
