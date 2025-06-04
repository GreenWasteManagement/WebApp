// STAT GRAPH LOGIC
document.addEventListener('DOMContentLoaded', function () {
    // a) Prepare an array of length 12, initialized to zero
    const monthlyCounts = new Array(12).fill(0);

    // b) Select all .item-row inside #deposits
    const rows = document.querySelectorAll('#deposits .item-row');

    rows.forEach((row, index) => {
        // Skip the very first row if it is the header ("Data", "Quantidade", "Contentor")
        if (index === 0) return;

        const dateText = row.querySelector('span').textContent.trim();
        const parsedDate = new Date(dateText);

        // Only count if parsing yields a valid date
        if (!isNaN(parsedDate)) {
            const monthIndex = parsedDate.getMonth(); // 0 = Jan, 1 = Feb, … 11 = Dec
            monthlyCounts[monthIndex]++;
        }
    });

    const highest = Math.max(...monthlyCounts);
    const yAxisMax = highest + 1;

    // c) Define month labels (you can change to localized names as needed)
    const monthLabels = [
        'Jan', 'Fev', 'Mar', 'Abr',
        'Mai', 'Jun', 'Jul', 'Ago',
        'Set', 'Out', 'Nov', 'Dez'
    ];

    // d) Get the 2D context of the <canvas>
    const ctx = document.getElementById('depositsChart').getContext('2d');

    // e) Create a bar chart with Chart.js
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                backgroundColor: '#057222',
                borderRadius: 6,   // slightly narrower bars
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
                        font: { size: 12, weight: '500' }
                    },
                    title: {
                        display: false
                    },
                    max: yAxisMax
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#333333',
                        font: { size: 12, weight: '500' }
                    },
                    title: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(5, 114, 34, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    callbacks: {
                        label: function(context) {
                            return ` ${context.parsed.y} depósitos`;
                        }
                    }
                }
            }
        }
    });
});