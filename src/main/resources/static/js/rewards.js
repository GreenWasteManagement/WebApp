document.addEventListener('DOMContentLoaded', async function () {
    function decodeJWT() {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            window.location.href = '/login';
            return null;
        }

        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
            console.error('Erro a decodificar JWT:', e);
            window.location.href = '/login';
            return null;
        }
    }

    const token = localStorage.getItem('jwt_token');
    const payload = decodeJWT();
    const userId = payload.id;

    // Fetch deposits
    const response = await fetch(`http://localhost:8080/api/buckets/deposits/municipality/${userId}`, {
        headers: {'Authorization': token}
    });
    const deposits = await response.json();

    let totalDeposited = 0;
    deposits.forEach(dep => {
        totalDeposited += dep.depositAmount;
    });

    console.log(totalDeposited);

    // Update total in HTML
    document.getElementById('totalDeposited').textContent = totalDeposited + 'Kg';

    // Goals for each card
    const goals = [{value: 100, reward: "Vale 5€ em compras no Mercado Municipal de Viana do Castelo"}, {
        value: 150,
        reward: "Entrada gratuita no Museu do Traje de Viana do Castelo"
    }, {value: 200, reward: "Passeio de funicular grátis a Santa Luzia"}, {
        value: 250,
        reward: "Vale 10€ para pastelarias típicas de Viana do Castelo"
    }, {value: 300, reward: "Bilhete duplo para o Teatro Municipal Sá de Miranda"}, {
        value: 350,
        reward: "Voucher para aulas de surf nas praias de Viana"
    }, {value: 400, reward: "Visita guiada ao Navio Gil Eannes"}, {
        value: 500,
        reward: "Vale 15€ em restaurantes de gastronomia minhota"
    }, {value: 600, reward: "Passeio de barco no rio Lima para duas pessoas"}, {
        value: 750,
        reward: "Experiência cultural: workshop de filigrana ou bordado tradicional vianense"
    }];

    // Render cards
    const rewardsList = document.getElementById('rewardsList');
    rewardsList.innerHTML = '';
    goals.forEach(goal => {
        const progress = Math.min(100, Math.round((totalDeposited / goal.value) * 100));
        const card = `
            <div class="reward-card">
                <div class="reward-description">
                    ${goal.reward}
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progress}%"></div>
                </div>
                <div class="progress-percentage">${progress}%</div>
                <div class="goal-label">Objetivo: ${goal.value} Kg</div>
            </div>
        `;
        rewardsList.insertAdjacentHTML('beforeend', card);
    });
});
