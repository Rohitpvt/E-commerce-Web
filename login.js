async function validateLoginForm(event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/;
    if (!passwordRegex.test(password)) {
        alert("Password must be between 8 and 20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.");
        return;
    }
    const loginData = {
        email: email,
        password: password
    };
    try {
        const response = await fetch('http://localhost:5002/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });
        if (response.ok) {

            if (email.endsWith('@adminhub.com')) {

                window.open("admin_page.html", "_blank");
            } else {

                window.open("homepage.html", "_blank");
            }
            window.close();
        } else {
            const errorData = await response.json();
            alert(errorData.message || "Login failed, please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred. Please try again later.");
    }
}
document.querySelector("form").addEventListener("submit", validateLoginForm);
