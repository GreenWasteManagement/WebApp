document.addEventListener('DOMContentLoaded', async function () {
    // 1. Populate the containers dropdown
    const select = document.getElementById('contentor');
    const token = localStorage.getItem('jwt_token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id; // or sub, as per the JWT

    const response = await fetch('http://localhost:8080/api/containers', {
        headers: {'Authorization': token}
    });
    const data = await response.json();
    const containers = data.containers || [];

    // Fill the select element
    select.innerHTML = '';
    containers.forEach(container => {
        const option = document.createElement('option');
        option.value = container.id;
        option.textContent = `Container #${container.id} (Capacity: ${container.capacity} Kg)`;
        select.appendChild(option);
    });

    // 2. Handle deposit form submission
    document.getElementById('depositForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const containerId = select.value;
        const quantity = document.getElementById('quantidade').value;

        // Build the request body
        const body = {
            municipality: {id: userId}, container: {id: Number(containerId)}, depositAmount: Number(quantity)
        };

        // Send POST request to register the deposit
        const res = await fetch('http://localhost:8080/api/buckets/deposit', {
            method: 'POST', headers: {
                'Content-Type': 'application/json', 'Authorization': token
            }, body: JSON.stringify(body)
        });

        if (res.ok) {
            alert('Deposit registered successfully!');
        } else {
            alert('Error registering deposit');
        }
        window.location.reload();
    });
});
