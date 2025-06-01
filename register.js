document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('registrationForm');
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        let isValid = true;
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('nameError');
        const namePattern = /^[A-Za-z]+$/;

        if (!namePattern.test(nameInput.value)) {
            nameError.textContent = 'Name must not contain symbols or spaces.';
            isValid = false;
        } else {
            nameError.textContent = '';
        }
        const phoneInput = document.getElementById('phone');
        const phoneError = document.getElementById('phoneError');
        const phonePattern = /^[0-9]+$/;

        if (!phonePattern.test(phoneInput.value)) {
            phoneError.textContent = 'Phone number must contain only numbers.';
            isValid = false;
        } else {
            phoneError.textContent = '';
        }
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('emailError');
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(emailInput.value)) {
            emailError.textContent = 'Please enter a valid email address.';
            isValid = false;
        } else {
            emailError.textContent = '';
        }
        const passwordInput = document.getElementById('password');
        const passwordError = document.getElementById('passwordError');
        const passwordConfirmInput = document.getElementById('confirm-password');
        const passwordConfirmError = document.getElementById('confirmPasswordError');
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/;
        if (!passwordPattern.test(passwordInput.value)) {
            passwordError.textContent = 'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one symbol.';
            isValid = false;
        } else {
            passwordError.textContent = '';
        }
        if (passwordInput.value !== passwordConfirmInput.value) {
            passwordConfirmError.textContent = 'Passwords do not match.';
            isValid = false;
        } else {
            passwordConfirmError.textContent = '';
        }
        if (isValid) {

            const formData = {
                name: nameInput.value,
                phone: phoneInput.value,
                emailAddress: emailInput.value,
                password: passwordInput.value,
                confirmPassword: passwordConfirmInput.value,
            };
            try {
                const response = await fetch('http://localhost:5001/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    window.location.href = 'admin_login.html';
                } else if (response.status === 409) {
                    alert("Admin with this email already exists.");
                } else {
                    alert("Registration failed, please try again.");
                }
            } catch (error) {
                console.error("Error during registration:", error);
                alert("An error occurred. Please try again later.");
            }
        }
    });
});
