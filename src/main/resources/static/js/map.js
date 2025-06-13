document.addEventListener("DOMContentLoaded", function () {
    // Initialize the map centered on Viana do Castelo
    const map = L.map("map").setView([41.6938, -8.8318], 13);

    // Map configuration
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    // Custom icon for containers
    const containerIcon = L.divIcon({
        className: "container-marker",
        html: `
            <div style="
                background-color: #15803d;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;">
                <div style="
                    width: 8px;
                    height: 8px;
                    background-color: white;
                    border-radius: 50%;">
                </div>
            </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
    });

    // Robust function to parse coordinates
    function parseLocalization(localizationString) {
        try {
            // Remove all non-numeric characters except comma, dot, and hyphen
            const cleanString = localizationString.replace(/[^\d.,-]/g, '');
            const [lat, lng] = cleanString.split(',').map(Number);

            return {
                latitude: lat || 0,
                longitude: lng || 0
            };
        } catch (e) {
            console.error('Error parsing coordinates:', localizationString, e);
            return {latitude: 0, longitude: 0};
        }
    }

    // Function to fetch and update map data
    function updateMapData() {
        fetch('http://localhost:8080/api/containers')
            .then(response => response.json())
            .then(data => {
                // Remove existing markers
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker) map.removeLayer(layer);
                });

                // Add new markers
                data.containers.forEach(container => {
                    const coords = parseLocalization(container.localization);
                    const popup = createPopupContent(container);

                    L.marker([coords.latitude, coords.longitude], {icon: containerIcon})
                        .addTo(map)
                        .bindPopup(popup);
                });
            })
            .catch(error => console.error("Request error:", error));
    }

    // Function to create popup content
    function createPopupContent(container) {
        const status = calculateStatus(container.currentVolumeLevel, container.capacity);

        return `
            <div class="container-popup">
                <h4>Contentor #${container.id}</h4>
                <p><strong>Capacidade:</strong> ${container.capacity}L</p>
                <p><strong>Nível Atual:</strong> ${container.currentVolumeLevel}L</p>
                <p><strong>Último Depósito:</strong><br>${getLastEvent(container.bucketMunicipalityContainers, 'deposit')}</p>
                <p><strong>Última Descarga:</strong><br>${getLastEvent(container.containerUnloadings, 'unloading')}</p>
                <span class="status ${status.class}">${status.text}</span>
            </div>`;
    }

    // Helper functions
    function calculateStatus(current, total) {
        const percent = (current / total) * 100;
        return {
            text: percent >= 90 ? 'Cheio' : percent <= 10 ? 'Vazio' : 'Operacional',
            class: percent >= 90 ? 'full' : percent <= 10 ? 'empty' : 'available'
        };
    }

    function getLastEvent(events, type) {
        if (!events?.length) return 'Nenhum registro';
        const last = events.reduce((a, b) =>
            new Date(a[`${type}Timestamp`]) > new Date(b[`${type}Timestamp`]) ? a : b
        );
        return `${last[type === 'deposit' ? 'depositAmount' : 'unloadedQuantity']}L - ${formatDate(last[`${type}Timestamp`])}`;
    }

    function formatDate(isoString) {
        return new Date(isoString).toLocaleString('pt-PT', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', ' -');
    }

    // Update data initially and every 30 seconds
    updateMapData();
    setInterval(updateMapData, 30000);
});
