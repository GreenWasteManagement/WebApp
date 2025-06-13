document.addEventListener('DOMContentLoaded', function () {
    const showPasswordsCheckbox = document.getElementById('showPasswords');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerForm = document.querySelector('.register-form');
    const errorMessageDiv = document.querySelector('.error-message');
    const successMessageDiv = document.querySelector('.success-message');

    // Função para mostrar erros
    function showError(message) {
        errorMessageDiv.querySelector('.error-list').innerHTML = `<li>${message}</li>`;
        errorMessageDiv.style.display = 'block';
        successMessageDiv.style.display = 'none';
    }

    // Função para mostrar sucesso
    function showSuccess(message) {
        successMessageDiv.querySelector('p').textContent = message;
        successMessageDiv.style.display = 'block';
        errorMessageDiv.style.display = 'none';
    }

    // Mostrar/Esconder passwords
    showPasswordsCheckbox.addEventListener('change', function () {
        const inputType = this.checked ? 'text' : 'password';
        passwordInput.type = inputType;
        confirmPasswordInput.type = inputType;
    });

    // Validação de password
    function validatePasswordMatch() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordInput.setCustomValidity('As palavras-passe não coincidem');
            showError('As palavras-passe não coincidem');
            return false;
        }
        confirmPasswordInput.setCustomValidity('');
        return true;
    }

    // Formatação de dados
    function formatPostalCode(postalCode) {
        return postalCode.replace('-', '');
    }

    // Construção do payload
    function buildPayload() {
        return {
            user: {
                name: document.getElementById('fullName').value.trim(),
                username: document.getElementById('username').value.trim(),
                email: document.getElementById('email').value.trim(),
                phoneNumber: document.getElementById('phoneNumber').value.trim(),
                password: passwordInput.value.trim()
            }, municipality: {
                citizenCardCode: document.getElementById('citizenCardNumber').value.trim(),
                nif: document.getElementById('nif').value.trim()
            }, address: {
                floorDetails: document.getElementById('floor').value.trim(),
                floorNumber: parseInt(document.getElementById('floor').value) || 0,
                doorNumber: parseInt(document.getElementById('doorNumber').value) || 0,
                street: document.getElementById('street').value.trim()
            }, postalCode: {
                postalCode: formatPostalCode(document.getElementById('postalCode').value.trim()), county: "", // Preencher conforme necessidade
                district: ""
            }
        };
    }

    // Envio do formulário
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Validações básicas
        if (!validatePasswordMatch()) return;

        const payload = buildPayload();

        try {
            const response = await fetch('http://localhost:8080/api/users/create/municipality', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro no registo');
            }

            showSuccess('Registo realizado com sucesso! Redirecionando...');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (error) {
            showError(error.message);
        }
    });

    // Validações em tempo real
    const validateField = (field, condition, errorMessage) => {
        field.addEventListener('input', () => {
            if (condition(field.value)) {
                field.style.borderColor = '#16a34a';
            } else {
                field.style.borderColor = '#dc2626';
                showError(errorMessage);
            }
        });
    };

    // Validações específicas
    validateField(document.getElementById('nif'), value => value.length === 9, 'NIF deve ter 9 dígitos');

    validateField(document.getElementById('citizenCardNumber'), value => value.length === 9, 'Nº Cartão Cidadão deve ter 9 dígitos');

    validateField(document.getElementById('phoneNumber'), value => value.length === 9, 'Nº Telemóvel deve ter 9 dígitos');

    // Auto-foco no primeiro campo
    document.getElementById('fullName').focus();
});
