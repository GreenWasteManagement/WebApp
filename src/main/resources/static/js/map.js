document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map").setView([41.6938, -8.8318], 13);

    // Configuração do mapa
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    // Ícone personalizado para os contentores
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

    // Função robusta para conversão de coordenadas
    function parseLocalization(localizationString) {
        try {
            // Remove todos os caracteres não numéricos exceto vírgula e ponto
            const cleanString = localizationString.replace(/[^\d.,-]/g, '');
            const [lat, lng] = cleanString.split(',').map(Number);

            return {
                latitude: lat || 0,
                longitude: lng || 0
            };
        } catch (e) {
            console.error('Erro na conversão:', localizationString, e);
            return { latitude: 0, longitude: 0 };
        }
    }

    // Função para buscar e atualizar dados
    function updateMapData() {
        fetch('http://localhost:8080/api/containers')
            .then(response => response.json())
            .then(data => {
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker) map.removeLayer(layer);
                });

                data.containers.forEach(container => {
                    const coords = parseLocalization(container.localization);
                    const popup = createPopupContent(container);

                    L.marker([coords.latitude, coords.longitude], { icon: containerIcon })
                        .addTo(map)
                        .bindPopup(popup);
                });
            })
            .catch(error => console.error("Erro na requisição:", error));
    }

    // Função para criar conteúdo do popup
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

    // Funções auxiliares
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

    // Atualiza os dados inicialmente e a cada 30 segundos
    updateMapData();
    setInterval(updateMapData, 30000);
});
