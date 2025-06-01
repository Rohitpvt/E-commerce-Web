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
        document.body.classList.remove('sidebar-open');
        cardContainer.classList.remove('sidebar-open');
    } else {
        sidebar.style.left = '0px';
        document.body.classList.add('sidebar-open');
        cardContainer.classList.add('sidebar-open');
    }
});
const cartItemsContainer = document.getElementById('cart-items');
const subtotalElement = document.getElementById('subtotal');
const proceedToBuyButton = document.getElementById('proceed-to-buy');

function updateCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="no-items-message">Your cart is empty.</p>`;
        subtotalElement.textContent = '';
        proceedToBuyButton.style.display = 'none';
        return;
    }
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        cartItemDiv.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}">
            <div class="product-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-selector">
                <button class="decrease-quantity-btn" data-name="${item.name}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="increase-quantity-btn" data-name="${item.name}">+</button>
            </div>
            <p class="item-total">$${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove-item-btn" data-name="${item.name}">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
        subtotal += item.price * item.quantity;
    });

    subtotalElement.textContent = `Subtotal: $${subtotal.toFixed(2)}`;

    document.querySelectorAll('.sidebar-links a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const categoryId = link.getAttribute('href').substring(1);
            localStorage.setItem('scrollToCategory', categoryId);
            window.location.href = 'homepage.html';
        });
    });

    let subtotalContainer = document.querySelector('.cart-summary');
    if (!subtotalContainer) {
        subtotalContainer = document.createElement('div');
        subtotalContainer.classList.add('cart-summary');
        cartItemsContainer.appendChild(subtotalContainer);
    }

    subtotalContainer.innerHTML = `<span class="subtotal">Subtotal: $${subtotal.toFixed(2)}</span>`;

    addRemoveEventListeners();
    addQuantityChangeEventListeners();

    const proceedToBuyButton = document.querySelector('.proceed-to-buy-btn');

    proceedToBuyButton.addEventListener('click', () => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add items to the cart before proceeding.");
            return;
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        localStorage.setItem('subtotal', subtotal.toFixed(2));

        window.location.href = 'checkout.html';
    });

}

function addRemoveEventListeners() {
    const removeButtons = document.querySelectorAll('.remove-item-btn');

    removeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const name = event.target.closest('.remove-item-btn').dataset.name;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            cart = cart.filter(item => item.name !== name);


            localStorage.setItem('cart', JSON.stringify(cart));
            localStorage.setItem('cartUpdated', Date.now());


            updateCart();
        });
    });
}


function addQuantityChangeEventListeners() {
    const increaseButtons = document.querySelectorAll('.increase-quantity-btn');
    const decreaseButtons = document.querySelectorAll('.decrease-quantity-btn');

    increaseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const name = event.target.dataset.name;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(item => item.name === name);
            if (item) {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                localStorage.setItem('cartUpdated', Date.now());
                updateCart();
            }
        });
    });

    decreaseButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const name = event.target.dataset.name;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const item = cart.find(item => item.name === name);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                localStorage.setItem('cartUpdated', Date.now());
                updateCart();
            }
        });
    });
}

window.addEventListener('storage', (event) => {
    if (event.key === 'cartUpdated') {
        updateCart();
    }
});


updateCart();
