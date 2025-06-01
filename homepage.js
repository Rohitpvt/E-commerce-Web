
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

document.addEventListener('DOMContentLoaded', async () => {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card-container');
    document.body.appendChild(cardContainer);


    try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();


        const productsByCategory = products.reduce((acc, product) => {
            if (!acc[product.category]) {
                acc[product.category] = [];
            }
            acc[product.category].push(product);
            return acc;
        }, {});


        Object.keys(productsByCategory).forEach(category => {

            const categoryHeading = document.createElement('h2');
            categoryHeading.classList.add('category-heading');
            categoryHeading.textContent = category;
            categoryHeading.id = category.toLowerCase();
            cardContainer.appendChild(categoryHeading);


            const categoryCardsContainer = document.createElement('div');
            categoryCardsContainer.classList.add('category-cards-container');


            productsByCategory[category].forEach(product => {
                const card = document.createElement('div');
                card.classList.add('card');


                const img = document.createElement('img');
                img.src = product.image_url;
                img.alt = product.name;
                card.appendChild(img);


                const plusButton = document.createElement('div');
                plusButton.classList.add('plus-button');
                plusButton.textContent = '+';
                plusButton.addEventListener('click', () => {
                    addToCart(product);
                });
                card.appendChild(plusButton);


                const name = document.createElement('h3');
                name.textContent = product.name;
                card.appendChild(name);


                const price = document.createElement('p');
                price.classList.add('price');
                price.textContent = `$${product.price}`;
                card.appendChild(price);


                const buttonContainer = document.createElement('div');
                buttonContainer.classList.add('button-container');

                const moreInfoButton = document.createElement('button');
                moreInfoButton.classList.add('more-info');
                moreInfoButton.textContent = 'More Info';
                moreInfoButton.setAttribute('onclick', `openProductPage(${JSON.stringify(product)})`);

                const buyNowButton = document.createElement('button');
                buyNowButton.classList.add('buy-now');
                buyNowButton.textContent = 'Buy Now';
                buyNowButton.addEventListener('click', () => buyNow(product));


                buttonContainer.appendChild(moreInfoButton);
                buttonContainer.appendChild(buyNowButton);
                card.appendChild(buttonContainer);


                categoryCardsContainer.appendChild(card);
            });


            cardContainer.appendChild(categoryCardsContainer);
        });

        const footer = document.createElement('footer');
        footer.classList.add('footer');
        footer.innerHTML = `
        </div>
        <a id = "top" class="top" href="#audio"><center>RETURN TO TOP</center></a>
      </div>
      <br></br>     
    <div class="footer-content">
       <h1>Contact us</h1>   
            <p><strong>Email:</strong> support@yourcompany.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Business Street, Suite 456, Tech City, CA 98765, USA</p>
            <p><strong>Office Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM (PST)</p>
            <br></br>
            <p >
              Copyright ©2022 All rights reserved | This webpage is made by
              <span class="redname">Rohit & Aman & Gurjyot</span>
            </p>
    </div>
`;
        document.body.appendChild(footer);



    } catch (error) {
        loadingMessage.textContent = 'Failed to load products. Please try again later.';
    }
});


const suggestionsList = document.getElementById('suggestions-list');
let activeIndex = -1;


searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    suggestionsList.innerHTML = '';

    if (query.length > 0) {

        const products = document.querySelectorAll('.card h3');
        let hasSuggestions = false;

        products.forEach((product) => {
            const productName = product.textContent.toLowerCase();
            if (productName.includes(query)) {
                hasSuggestions = true;
                const suggestionItem = document.createElement('li');
                suggestionItem.textContent = product.textContent;
                suggestionItem.addEventListener('click', () => {
                    searchInput.value = product.textContent;
                    suggestionsList.style.display = 'none';
                    scrollToProduct(product);


                    searchBarContainer.classList.remove('show-search-bar', 'show-search-bar-settle');
                    overlay.style.display = 'none';
                    setTimeout(() => {
                        searchBarContainer.style.display = 'none';
                    }, 300);
                });
                suggestionsList.appendChild(suggestionItem);
            }
        });


        suggestionsList.style.display = hasSuggestions ? 'block' : 'none';
    } else {
        suggestionsList.style.display = 'none';
    }
});



function scrollToProduct(productElement) {
    const card = productElement.closest('.card');
    const offset = 100;
    const targetOffsetTop = card.offsetTop - offset;

    requestAnimationFrame(() => {
        window.scrollTo({
            top: targetOffsetTop,
            behavior: 'smooth'
        });

        card.classList.add('highlight-animation');


        setTimeout(() => card.classList.remove('highlight-animation'), 1500);
    });
}



function openProductPage(product) {
    console.log("Opening product page for:", product);
    try {

        localStorage.setItem('selectedProduct', JSON.stringify(product));

        window.open('product-details.html', '_blank');
    } catch (error) {
        console.error("Error in openProductPage:", error);
    }
}


function updateActiveSuggestion(suggestions) {
    suggestions.forEach((item, index) => {
        item.classList.toggle('active', index === activeIndex);
    });
}


document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.style.display = 'none';
    }
});


function addToCart(product) {
    console.log(`Adding product with Name: ${product.name}`);


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
}


function buyNow(product) {
    console.log(`Proceeding to checkout with product: ${product.name}`);


    const productForCheckout = {
        ...product,
        quantity: 1
    };

    localStorage.setItem('checkoutProduct', JSON.stringify(productForCheckout));


    window.location.href = 'checkout.html';
}


document.addEventListener('DOMContentLoaded', () => {
    const aboutLink = document.getElementById('aboutLink');
    const aboutPopup = document.getElementById('aboutPopup');
    const overlay = document.getElementById('overlay');

    function showAboutPopup() {
        aboutPopup.classList.add('show-popup');
        overlay.classList.add('active');
    }

    function hideAboutPopup() {
        aboutPopup.classList.remove('show-popup');
        overlay.classList.remove('active');
    }

    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        showAboutPopup();
    });

    overlay.addEventListener('click', hideAboutPopup);
});




