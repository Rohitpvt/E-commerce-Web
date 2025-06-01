

let shipping = 5.00;
let discount = 0.00;

document.addEventListener("DOMContentLoaded", () => {

    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];


    if (checkoutProduct) {
        cartItems.push(checkoutProduct);
    }

    const cartItemsContainer = document.getElementById("cartItems");


    cartItems.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <p class="item-name">${item.name}</p>
            <p class="item-quantity">${item.quantity}</p>
            <p class="item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        `;
        cartItemsContainer.appendChild(cartItem);
    });


    updateTotal(cartItems);
});


function updateTotal(cartItems) {

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
    document.getElementById("discount").textContent = `$${discount.toFixed(2)}`;

    const total = subtotal + shipping - discount;
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
}


function applyCoupon() {
    let couponCode = document.getElementById("couponCode").value;
    if (couponCode === "GAR50") {
        const subtotal = parseFloat(document.getElementById("subtotal").textContent.replace('$', ''));
        discount = subtotal * 0.5;
        alert("Coupon applied successfully! 50% off on subtotal.");
    } else {
        discount = 0.00;
        alert("Invalid coupon code.");
    }

    updateTotal(JSON.parse(localStorage.getItem("cart")) || []);
}

document.addEventListener("DOMContentLoaded", () => {
    const payNowButton = document.getElementById("payNowButton");

    if (!payNowButton) {
        console.error("Button with ID 'payNowButton' not found.");
        return;
    }


    payNowButton.addEventListener("click", () => {
        const pincode = document.getElementById("pincode").value.trim();
        const flat = document.getElementById("flat").value.trim();
        const area = document.getElementById("area").value.trim();
        const town = document.getElementById("town").value.trim();
        const state = document.getElementById("state").value.trim();
        const landmark = document.getElementById("landmark").value.trim();


        if (!pincode || !flat || !area || !town || !state) {
            alert("Please fill in all required fields for the delivery address.");
            return;
        }


        if ((JSON.parse(localStorage.getItem("cart")) || []).length === 0) {
            alert("Please add items in cart first!");
            return;
        }


        function saveAddressData() {
            const addressData = { pincode, flat, area, town, state, landmark };
            localStorage.setItem("addressData", JSON.stringify(addressData));
        }


        function saveCartAndTotals() {
            const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
            const subtotal = parseFloat(document.getElementById("subtotal").textContent.replace('$', '')) || 0;
            const shipping = parseFloat(document.getElementById("shipping").textContent.replace('$', '')) || 0;
            const discount = parseFloat(document.getElementById("discount").textContent.replace('$', '')) || 0;
            const grandTotal = subtotal + shipping - discount;


            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            localStorage.setItem("subtotal", subtotal);
            localStorage.setItem("shipping", shipping);
            localStorage.setItem("discount", discount);
            localStorage.setItem("grandTotal", grandTotal.toFixed(2));
        }



        saveAddressData();
        saveCartAndTotals();
        window.location.href = "payment.html";
    });
});


const checkoutProduct = JSON.parse(localStorage.getItem('checkoutProduct'));

if (checkoutProduct) {

    document.getElementById('cartItems').innerHTML = `
        <div class="cart-item">
            <p class="item-name">${checkoutProduct.name}</p>
            <p class="item-quantity">${checkoutProduct.quantity}</p>
            <p class="item-price">$${(checkoutProduct.price * checkoutProduct.quantity).toFixed(2)}</p>
        </div>
    `;


    updateTotal([checkoutProduct]);
} else {
    console.error('No checkout product data found in localStorage');
}


updateTotal();
