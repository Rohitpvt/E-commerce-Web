const toggleButton = document.getElementById('dark-mode');
const body = document.body;
toggleButton.addEventListener('change', () => {
    const theme = toggleButton.checked ? 'dark' : 'light';
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    toggleButton.checked = (savedTheme === 'dark');
}
const searchIcon = document.querySelector('.search-icon');
const searchBarContainer = document.querySelector('.search-bar-container');
const searchInput = document.querySelector('.search-bar-input');
const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);
function toggleSearchBar() {
    if (searchBarContainer.classList.contains('show-search-bar')) {
        searchBarContainer.classList.remove('show-search-bar', 'show-search-bar-settle');
        overlay.style.display = 'none';
        setTimeout(() => {
            searchBarContainer.style.display = 'none';
        }, 300);
    } else {
        overlay.style.display = 'block';
        searchBarContainer.style.display = 'block';
        setTimeout(() => {
            searchBarContainer.classList.add('show-search-bar', 'show-search-bar-settle');
        }, 10);
    }
}
searchIcon.addEventListener('click', toggleSearchBar);
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && searchBarContainer.classList.contains('show-search-bar')) {
        toggleSearchBar();
    }
});
overlay.addEventListener('click', toggleSearchBar);
const menuIcon = document.querySelector('.menu-icon');
const sidebar = document.getElementById('sidebar');
const cardContainer = document.querySelector('.card-container');


menuIcon.addEventListener('click', () => {
    if (sidebar.style.left === '0px') {

        sidebar.style.left = '-250px';
        document.body.classList.remove('sidebar-open');
        cardContainer.classList.remove('sidebar-open');
    } else {

        sidebar.style.left = '0px';
        document.body.classList.add('sidebar-open');
        cardContainer.classList.add('sidebar-open');
    }
});
const product = JSON.parse(localStorage.getItem('selectedProduct'));
if (product) {
    document.getElementById('product-image').src = product.image_url;
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-brand').textContent = `Brand: ${product.brand}`;
    document.getElementById('product-price').textContent = `₹${product.price.toFixed(2)}`;
    document.getElementById('product-rating').textContent = `Rating: ${product.rating} ⭐`;
    document.getElementById('product-description').textContent = product.product_description;
} else {
    console.error('No product data found in localStorage');
}
let quantity = 1;
const quantityDisplay = document.getElementById('quantity');

document.getElementById('increase-quantity').addEventListener('click', () => {
    quantity += 1;
    quantityDisplay.textContent = quantity;
});
document.getElementById('decrease-quantity').addEventListener('click', () => {
    if (quantity > 1) {
        quantity -= 1;
        quantityDisplay.textContent = quantity;
    }
});
document.getElementById('add-to-cart').addEventListener('click', () => {
    alert(`Added ${quantity} ${product.name}(s) to the cart.`);

});

document.getElementById('buy-now').addEventListener('click', () => {
    const productData = {
        name: document.getElementById('product-name').textContent,
        brand: document.getElementById('product-brand').textContent,
        price: parseFloat(document.getElementById('product-price').textContent.replace('₹', '')),
        rating: document.getElementById('product-rating').textContent,
        description: document.getElementById('product-description').textContent,
        quantity: quantity,
    };
    localStorage.setItem('checkoutProduct', JSON.stringify(productData));
    window.location.href = 'checkout.html';
});
function addToCart(productName) {
    console.log(`Adding product with Name: ${productName}`);

    fetch(`http://localhost:5000/api/products`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(products => {
            const product = products.find(p => p.name === productName);

            if (!product) {
                console.error(`Product ${productName} not found`);
                return;
            }
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (!Array.isArray(cart)) {
                console.warn('Cart data was not an array. Resetting to an empty array.');
                cart = [];
            }
            const existingProduct = cart.find(item => item.name === product.name);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                product.quantity = 1;
                cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('cartUpdated', Date.now());
            alert(`${product.name} has been added to your cart!`);
        })
        .catch(error => console.error('Error fetching products:', error));
}
