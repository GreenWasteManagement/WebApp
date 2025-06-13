document.addEventListener('DOMContentLoaded', function () {
    const editModal = document.querySelector('.openEditProfileModal');
    const form = editModal.querySelector('form');

    async function loadProfileData() {
        const token = localStorage.getItem('jwt_token');
        const payload = JSON.parse(atob(token.split('.')[1]));

        const response = await fetch(`http://localhost:8080/api/users/get/municipality/${payload.id}`, {
            method: 'POST', headers: {'Authorization': token}
        });
        const data = await response.json();

        // Populate form fields
        document.getElementById('nome').value = data.user.name || '';
        document.getElementById('utilizador').value = data.user.username || '';
        document.getElementById('email').value = data.user.email || '';
        document.getElementById('telefone').value = data.user.phoneNumber || '';
        document.getElementById('cc').value = data.municipality.citizenCardCode || '';
        document.getElementById('nif').value = data.municipality.nif || '';
        document.getElementById('rua').value = data.address.street || '';
        document.getElementById('porta').value = data.address.doorNumber || '';
        document.getElementById('andar').value = data.address.floorNumber || '';
        document.getElementById('andarInfo').value = data.address.floorDetails || '';

        // Postal code
        if (data.postalCode?.postalCode) {
            const [cod1, cod2] = data.postalCode.postalCode.split('-');
            document.getElementById('cod1').value = cod1 || '';
            document.getElementById('cod2').value = cod2 || '';
        }

        // Set data-attributes for IDs
        document.getElementById('utilizador').dataset.userId = data.user.id;
        document.getElementById('rua').dataset.addressId = data.address.id;
        document.getElementById('cod1').dataset.postalCodeId = data.postalCode.id;
        document.getElementById('cc').dataset.municipalityId = data.municipality.id;
    }

    // Validate postal code using GeoAPI.pt
    async function isVianaDoCasteloPostalCode(codigoPostal) {
        try {
            // API expects format "4900-123"
            const response = await fetch(`https://geoapi.pt/cp/${codigoPostal}`);
            if (!response.ok) throw new Error('API did not respond');
            const data = await response.json();
            // The relevant field is "concelho"
            return data.concelho && data.concelho.toLowerCase() === "viana do castelo";
        } catch (e) {
            // Fallback: accept prefix 4900 as valid
            return codigoPostal.startsWith('4900');
        }
    }

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const cod1 = document.getElementById('cod1').value;
        const cod2 = document.getElementById('cod2').value;
        const codigoPostal = `${cod1}-${cod2}`;

        const isValid = await isVianaDoCasteloPostalCode(codigoPostal);
        if (!isValid) {
            alert('O Código Postal não pertence a Viana do Castelo. Por favor insira um Código Postal Válido');
            return;
        }

        // Build payload for update
        const payload = {
            user: {
                id: document.getElementById('utilizador').dataset.userId,
                name: document.getElementById('nome').value,
                username: document.getElementById('utilizador').value,
                email: document.getElementById('email').value,
                phoneNumber: document.getElementById('telefone').value
            }, address: {
                id: document.getElementById('rua').dataset.addressId,
                street: document.getElementById('rua').value,
                doorNumber: document.getElementById('porta').value,
                floorNumber: document.getElementById('andar').value,
                floorDetails: document.getElementById('andarInfo').value
            }, postalCode: {
                id: document.getElementById('cod1').dataset.postalCodeId,
                postalCode: codigoPostal,
                county: "Viana do Castelo",
                district: "Viana do Castelo"
            }, municipality: {
                id: document.getElementById('cc').dataset.municipalityId,
                citizenCardCode: document.getElementById('cc').value,
                nif: document.getElementById('nif').value
            }
        };

        // Send update
        try {
            const response = await fetch('http://localhost:8080/api/users/update-full-municipality', {
                method: 'PUT', headers: {
                    'Content-Type': 'application/json', 'Authorization': localStorage.getItem('jwt_token')
                }, body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Perfil atualizado com sucesso!');
                window.location.reload();
            } else {
                alert('Erro a atualizar Perfil !');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    // Open modal
    document.querySelectorAll('[onclick*="openEditProfileModal"]').forEach(btn => {
        btn.onclick = async (e) => {
            e.preventDefault();
            await loadProfileData();
            editModal.style.display = 'flex';
        };
    });

    // Close modal
    editModal.querySelectorAll('.modal-close, .modal-btn-cancel').forEach(btn => {
        btn.onclick = () => editModal.style.display = 'none';
    });
});
