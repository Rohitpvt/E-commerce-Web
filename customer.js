async function fetchCustomers() {
    try {
        const response = await fetch('http://localhost:5001/api/register');
        if (!response.ok) {
            throw new Error('Failed to fetch customers');
        }
        const customers = await response.json();
        populateCustomerTable(customers);
    } catch (error) {
        console.error('Error fetching customer data:', error);
    }
}
function populateCustomerTable(customers) {
    const tableBody = document.querySelector('#customerTable tbody');
    tableBody.innerHTML = '';

    customers.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.name}</td>
            <td>${customer.phone}</td>
            <td>${customer.emailAddress}</td>
        `;
        tableBody.appendChild(row);
    });
}


console.log('Customer script loaded');
window.onload = fetchCustomers;

window.onload = fetchCustomers;
