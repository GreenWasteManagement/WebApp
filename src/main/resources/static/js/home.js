// Garante que todo o HTML esteja carregado antes de usar L.map()
document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map").setView([41.6938, -8.8318], 13);

    // 2) Adicionar camada de tiles do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    // 3) Ícone custom para os marcadores de contentor
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
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
    });

    // 4) Dados de exemplo (substitua esta parte pelo seu fetch ao backend)
    const containers = [
        {
            id: 1,
            name: "Contentor Centro Histórico",
            latitude: 41.6938,
            longitude: -8.8318,
            address: "Praça da República",
            status: "available",
            capacity: 85,
            lastCollection: "2025-01-02",
        },
        {
            id: 2,
            name: "Contentor Parque da Cidade",
            latitude: 41.6889,
            longitude: -8.8267,
            address: "Parque da Cidade",
            status: "full",
            capacity: 100,
            lastCollection: "2024-12-30",
        },
        {
            id: 3,
            name: "Contentor Zona Industrial",
            latitude: 41.7012,
            longitude: -8.8445,
            address: "Zona Industrial",
            status: "available",
            capacity: 45,
            lastCollection: "2025-01-01",
        },
        {
            id: 4,
            name: "Contentor Meadela",
            latitude: 41.7089,
            longitude: -8.8234,
            address: "Meadela",
            status: "maintenance",
            capacity: 0,
            lastCollection: "2024-12-28",
        },
        {
            id: 5,
            name: "Contentor Santa Marta",
            latitude: 41.6823,
            longitude: -8.8156,
            address: "Santa Marta de Portuzelo",
            status: "available",
            capacity: 65,
            lastCollection: "2025-01-01",
        },
        {
            id: 6,
            name: "Contentor Darque",
            latitude: 41.6756,
            longitude: -8.8567,
            address: "Darque",
            status: "available",
            capacity: 30,
            lastCollection: "2024-12-31",
        },
    ];

    // 5) Função para retornar texto e classe CSS baseado no status
    function getStatusInfo(status) {
        switch (status) {
            case "available":
                return { text: "Disponível", class: "status-available" };
            case "full":
                return { text: "Cheio", class: "status-full" };
            case "maintenance":
                return { text: "Manutenção", class: "status-maintenance" };
            default:
                return { text: "Desconhecido", class: "status-available" };
        }
    }

    // 6) Adicionar marcadores e popups para cada contentor
    containers.forEach((container) => {
        const statusInfo = getStatusInfo(container.status);

        const popupContent = `
      <div class="container-popup">
        <h4>${container.name}</h4>
        <p><strong>Morada:</strong> ${container.address}</p>
        <p><strong>Capacidade:</strong> ${container.capacity}%</p>
        <p><strong>Última recolha:</strong> ${container.lastCollection}</p>
      </div>
    `;

        L.marker([container.latitude, container.longitude], {
            icon: containerIcon,
        })
            .addTo(map)
            .bindPopup(popupContent);
    });


    // 9) Exemplo de fetch (descomente quando seu backend estiver pronto)
    /*
    fetch('/api/containers')
      .then((response) => response.json())
      .then((data) => {
        // Remover marcadores antigos, se necessário...
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        data.forEach((container) => {
          const statusInfo = getStatusInfo(container.status);
          const popupContent = `
            <div class="container-popup">
              <h4>${container.name}</h4>
              <p><strong>Morada:</strong> ${container.address}</p>
              <p><strong>Capacidade:</strong> ${container.capacity}%</p>
              <p><strong>Última recolha:</strong> ${container.lastCollection}</p>
              <span class="container-status ${statusInfo.class}">
                ${statusInfo.text}
              </span>
            </div>
          `;
          L.marker([container.latitude, container.longitude], {
            icon: containerIcon,
          })
            .addTo(map)
            .bindPopup(popupContent);
        });
      })
      .catch((error) => console.error("Erro ao buscar contentores:", error));
    */
});
