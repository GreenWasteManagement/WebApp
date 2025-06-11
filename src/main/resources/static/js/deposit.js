document.addEventListener('DOMContentLoaded', async function () {
    // 1. Preencher o dropdown de contentores
    const select = document.getElementById('contentor');
    const token = localStorage.getItem('jwt_token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id; // ou sub, conforme o JWT

    // Buscar contentores
    const response = await fetch('http://localhost:8080/api/containers', {
        headers: {'Authorization': token}
    });
    const data = await response.json();
    const containers = data.containers || [];

    // Preencher o select
    select.innerHTML = '';
    containers.forEach(container => {
        const option = document.createElement('option');
        option.value = container.id;
        option.textContent = `Contentor #${container.id} (Capacidade: ${container.capacity} Kg)`;
        select.appendChild(option);
    });

    // 2. Submeter o formulário de depósito
    document.getElementById('depositForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const containerId = select.value;
        const quantidade = document.getElementById('quantidade').value;

        // Montar o corpo do pedido
        const body = {
            municipality: {id: userId}, container: {id: Number(containerId)}, depositAmount: Number(quantidade)
        };

        // Enviar o POST para criar o depósito
        const res = await fetch('http://localhost:8080/api/buckets/deposit', {
            method: 'POST', headers: {
                'Content-Type': 'application/json', 'Authorization': token
            }, body: JSON.stringify(body)
        });

        if (res.ok) {
            alert('Depósito registado com sucesso!');
            // Opcional: fechar modal, atualizar lista, etc.
        } else {
            alert('Erro ao registar depósito');
        }
        window.location.reload();
    });
});
