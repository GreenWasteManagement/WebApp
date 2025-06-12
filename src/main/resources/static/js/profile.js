function openDepositModal() {
    document.querySelector('.openDepositModal').style.display = 'flex';
}

function openEditProfileModal() {
    document.querySelector('.openEditProfileModal').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', function () {
    // Modal handling
    document.querySelector('.openDepositModal .modal-close').onclick = closeModals;
    document.querySelector('.openDepositModal .modal-btn-cancel').onclick = closeModals;
    document.querySelector('.openEditProfileModal .modal-close').onclick = closeModals;
    document.querySelector('.openEditProfileModal .modal-btn-cancel').onclick = closeModals;

    // Main data loading
    loadUserData();
});

function clearStorageAndRedirect() {
    // Apaga todo o localStorage
    localStorage.clear();

    // Redireciona para o link desejado
    window.location.href = 'http://localhost:8081/';
}



// JWT handling
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

// API functions
async function loadUserData() {
    const payload = decodeJWT();
    if (!payload) return;

    try {
        // Só este endpoint mudou para POST
        const userRes = await fetch(`http://localhost:8080/api/users/get/municipality/${payload.id}`, {
            method: 'POST', headers: {
                'Content-Type': 'application/json', 'accept': '*/*'
            }, body: ''
        });

        // Os outros continuam GET
        const [bucketsRes, depositsRes] = await Promise.all([fetch(`http://localhost:8080/api/buckets/buckets-municipalities/${payload.id}`), fetch(`http://localhost:8080/api/buckets/deposits/municipality/${payload.id}`)]);

        const userData = await userRes.json();
        const bucketsData = await bucketsRes.json();
        const depositsData = await depositsRes.json();

        populateProfile(userData);
        populateBuckets(bucketsData.bucketMunicipalities);
        populateDeposits(depositsData);
    } catch (error) {
        console.error('Erro a carregar dados:', error);
    }
}

// Data population
function populateProfile(data) {
    console.log(data);
    const fields = {
        'name': data.user.name,
        'username': data.user.username,
        'email': data.user.email,
        'phoneNumber': data.user.phoneNumber,
        'citizenCard': data.municipality.citizenCardCode,
        'nif': data.municipality.nif,
        'address': `${data.address.street}, ${data.address.doorNumber}`
    };

    Object.entries(fields).forEach(([key, value]) => {
        document.querySelector(`[data-field="${key}"]`).textContent = value;
    });
}

async function populateBuckets(associations) {
    const container = document.querySelector('#buckets-list');
    container.innerHTML = '';

    for (const assoc of associations) {
        const res = await fetch(`http://localhost:8080/api/buckets/${assoc.bucketId}`);
        const {bucket} = await res.json();

        const html = `
            <div class="item-row">
                <span>${bucket.id}</span>
                <span>${bucket.capacity / 1000} Kg</span>
                <span>${assoc.status ? 'Ativo' : 'Inativo'}</span>
            </div>
            <div class="empty-line"></div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    }
}

function populateDeposits(deposits) {
    const container = document.querySelector('#deposits');
    container.innerHTML = `
        <div class="item-row">
            <span>Data</span>
            <span>Quantidade</span>
            <span>Contentor</span>
        </div>
        <div class="empty-line"></div>
    `;

    deposits.forEach(deposit => {
        const html = `
            <div class="item-row">
                <span>${new Date(deposit.depositTimestamp).toLocaleDateString('pt-PT')}</span>
                <span>${deposit.depositAmount} Kg</span>
                <span>${deposit.container.id}</span>
            </div>
            <div class="empty-line"></div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });

    updateChart(deposits);
}

// Chart logic
function updateChart(deposits) {
    const monthlyCounts = new Array(12).fill(0);

    deposits.forEach(deposit => {
        const month = new Date(deposit.depositTimestamp).getMonth();
        monthlyCounts[month]++;
    });

    // Define os labels dos meses
    const monthLabels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    // Calcula o máximo do eixo Y
    const highest = Math.max(...monthlyCounts);
    const yAxisMax = highest + 1;

    const ctx = document.getElementById('depositsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                backgroundColor: '#057222',
                borderRadius: 6,
                categoryPercentage: 0.7,
                data: monthlyCounts
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#d1d5db',
                        borderDash: [4, 4]
                    },
                    ticks: {
                        stepSize: 1,
                        color: '#333333',
                        font: {size: 12, weight: '500'}
                    },
                    title: {display: false},
                    max: yAxisMax
                },
                x: {
                    grid: {display: false},
                    ticks: {
                        color: '#333333',
                        font: {size: 12, weight: '500'}
                    },
                    title: {display: false}
                }
            },
            plugins: {
                legend: {display: false},
                tooltip: {
                    backgroundColor: 'rgba(5, 114, 34, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function (context) {
                            return ` ${context.parsed.y} depósitos`;
                        }
                    }
                }
            }
        }
    });
}


function closeModals() {
    document.querySelectorAll('.modal-bg').forEach(modal => {
        modal.style.display = 'none';
    });
}
