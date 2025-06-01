
document.addEventListener("DOMContentLoaded", () => {

    const toggleButton = document.getElementById('dark-mode');
    const body = document.body;


    toggleButton.addEventListener('change', () => {
        if (toggleButton.checked) {

            body.setAttribute('data-theme', 'dark');
        } else {

            body.removeAttribute('data-theme');
        }
    });



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



    const orderNumber = `#${generateRandomOrderNumber()}`;
    document.getElementById("orderNumber").textContent = orderNumber;


    const currentDate = new Date().toLocaleDateString();
    document.getElementById("orderDate").textContent = currentDate;


    let addressData;
    try {
        addressData = JSON.parse(localStorage.getItem("addressData"));
    } catch (e) {
        console.error("Failed to parse address data:", e);
    }

    const addressDisplay = document.querySelector(".address-display");

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }


    if (addressData) {
        addressDisplay.innerHTML = `
            <div class="address-entry"><div class="address-heading">Pincode:</div><div class="address-value">${capitalizeFirstLetter(addressData.pincode)}</div></div>
            <div class="address-entry"><div class="address-heading">Flat/House:</div><div class="address-value">${capitalizeFirstLetter(addressData.flat)}</div></div>
            <div class="address-entry"><div class="address-heading">Area/Street:</div><div class="address-value">${capitalizeFirstLetter(addressData.area)}</div></div>
            <div class="address-entry"><div class="address-heading">Landmark:</div><div class="address-value">${capitalizeFirstLetter(addressData.landmark)}</div></div>
            <div class="address-entry"><div class="address-heading">Town/City:</div><div class="address-value">${capitalizeFirstLetter(addressData.town)}</div></div>
            <div class="address-entry"><div class="address-heading">State:</div><div class="address-value">${capitalizeFirstLetter(addressData.state)}</div></div>
        `;
    } else {
        addressDisplay.innerHTML = "<p style='color: red;'>Address not found. Please provide your address information.</p>";
    }


    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const orderItemsContainer = document.getElementById("orderItems");

    cartItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("order-item");
        itemElement.innerHTML = `
            <img src="${item.image_url}" alt="${item.name}">
            <div class="order-item-info">
                <p><strong>${item.name}</strong></p>
                <p>Qty: ${item.quantity}</p>
            </div>
            <p>$${(item.price * item.quantity).toFixed(2)}</p>
        `;
        orderItemsContainer.appendChild(itemElement);
    });




    const subtotal = parseFloat(localStorage.getItem("subtotal")) || 0;
    const shipping = parseFloat(localStorage.getItem("shipping")) || 0;
    const discount = parseFloat(localStorage.getItem("discount")) || 0;
    const total = subtotal + shipping - discount;

    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
    document.getElementById("discount").textContent = `$${discount.toFixed(2)}`;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;


    function generateRandomOrderNumber() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let letterPart = "";
        for (let i = 0; i < 3; i++) {
            letterPart += letters.charAt(Math.floor(Math.random() * letters.length));
        }

        let digitPart = "";
        for (let i = 0; i < 7; i++) {
            digitPart += Math.floor(Math.random() * 10);
        }

        return `${letterPart}-${digitPart}`;
    }


    document.getElementById("trackOrderButton").addEventListener("click", () => {

        localStorage.removeItem("cart");
        localStorage.removeItem("addressData");
        localStorage.removeItem("subtotal");
        localStorage.removeItem("shipping");
        localStorage.removeItem("discount");
        localStorage.removeItem("grandTotal");


        window.location.href = "homepage.html";
    });
});
