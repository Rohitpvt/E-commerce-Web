document.addEventListener("DOMContentLoaded", () => {
    function updateTotal(cartItems) {
        const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const shipping = parseFloat(localStorage.getItem("shipping")) || 0;
        const discount = parseFloat(localStorage.getItem("discount")) || 0;
        const total = subtotal + shipping - discount;
        const grandTotal = total;
        localStorage.setItem("subtotal", subtotal);
        localStorage.setItem("shipping", shipping);
        localStorage.setItem("discount", discount);
        localStorage.setItem("grandTotal", grandTotal);
        document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
        document.getElementById("discount").textContent = `$${discount.toFixed(2)}`;
        document.getElementById("total").textContent = `$${grandTotal.toFixed(2)}`;
    }
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
    }
    else {

        addressDisplay.textContent = "Address not found.";
    }
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
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

    document.getElementById("codButton").addEventListener("click", () => {
        console.log("Pay On Delivery button clicked.");
        const paymentOptions = document.querySelectorAll('input[name="payment"]');
        const selectedOption = Array.from(paymentOptions).find(option => option.checked);
        if (!selectedOption) {
            alert("Please select a payment method before proceeding.");
            return;
        }
        if (selectedOption.value !== "cod") {
            alert("This payment method is currently under maintenance. Please choose Cash on Delivery.");
            return;
        }
        window.location.href = "confirmation.html";
    });
});
