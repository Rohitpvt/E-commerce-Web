
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const menuToggle = document.querySelector('.menu-toggle');
const body = document.body;

document.addEventListener("mousemove", function (event) {
    const scrollbar = document.querySelector("body::-webkit-scrollbar");
    if (event.clientY < window.innerHeight - 50) {

        document.body.style.overflowY = "hidden";
    } else {

        document.body.style.overflowY = "scroll";
    }
});


if (sidebar && mainContent && menuToggle) {

    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('collapsed');
    });
}


function loadPage(pageUrl) {
    fetch(pageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(data => {
            document.querySelector('.main-content').innerHTML = data;


            if (pageUrl === 'products.html') {
                loadProductsScripts();
            }
            checkScrollable();
        })
        .catch(error => {
            console.error('Error loading page:', error);
            document.querySelector('.main-content').innerHTML = "<p>Page not found.</p>";
        });
}


function loadCustomerScripts() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'customer.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'customer.js';
    script.onload = function () {

        fetchCustomers();
    };
    document.body.appendChild(script);
}

function loadProductsScripts() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'products.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'products.js';
    script.onload = function () {

        fetchProducts();
    };
    document.body.appendChild(script);
}


function openLogoutModal() {
    const logoutModal = document.getElementById('logoutModal');
    if (logoutModal) {
        logoutModal.style.display = 'flex';
    }
}


function closeLogoutModal() {
    const logoutModal = document.getElementById('logoutModal');
    if (logoutModal) {
        logoutModal.style.display = 'none';
    }
}


function confirmLogout() {

    window.open('admin_register.html', '_blank');


    window.close();

}





function checkScrollable() {

    if (body.scrollHeight > window.innerHeight) {
        body.classList.add('scrollable');
    } else {
        body.classList.remove('scrollable');
    }
}


window.onload = checkScrollable;


window.onresize = checkScrollable;



