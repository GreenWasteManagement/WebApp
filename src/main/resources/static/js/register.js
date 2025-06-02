document.addEventListener('DOMContentLoaded', function() {
    const showPasswordsCheckbox = document.getElementById('showPasswords');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const registerForm = document.querySelector('.register-form');

    // Show/Hide passwords functionality
    showPasswordsCheckbox.addEventListener('change', function() {
        const inputType = this.checked ? 'text' : 'password';
        passwordInput.type = inputType;
        confirmPasswordInput.type = inputType;
    });

    // Password confirmation validation
    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordInput.setCustomValidity('As palavras-passe não coincidem');
        } else {
            confirmPasswordInput.setCustomValidity('');
        }
    }

    passwordInput.addEventListener('input', validatePasswordMatch);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    // Postal code formatting (Portuguese format: XXXX-XXX)
    const postalCodeInput = document.getElementById('postalCode');
    postalCodeInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length >= 4) {
            value = value.substring(0, 4) + '-' + value.substring(4, 7);
        }
        e.target.value = value;
    });

    // Phone number formatting (Portuguese mobile format)
    const phoneInput = document.getElementById('phoneNumber');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        e.target.value = value;
    });

    // Citizen card number formatting
    const citizenCardInput = document.getElementById('citizenCardNumber');
    citizenCardInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        e.target.value = value;
    });

    // NIF formatting
    const nifInput = document.getElementById('nif');
    nifInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 9) {
            value = value.substring(0, 9);
        }
        e.target.value = value;
    });

    // Form validation before submission
    registerForm.addEventListener('submit', function(e) {
        const requiredFields = registerForm.querySelectorAll('input[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#dc2626';
            } else {
                field.style.borderColor = '';
            }
        });

        // Check password match
        if (passwordInput.value !== confirmPasswordInput.value) {
            isValid = false;
            confirmPasswordInput.style.borderColor = '#dc2626';
            alert('As palavras-passe não coincidem.');
        }

        // Validate NIF (basic check)
        const nifValue = nifInput.value;
        if (nifValue && nifValue.length !== 9) {
            isValid = false;
            nifInput.style.borderColor = '#dc2626';
            alert('O NIF deve ter 9 dígitos.');
        }

        // Validate citizen card number
        const citizenCardValue = citizenCardInput.value;
        if (citizenCardValue && citizenCardValue.length !== 9) {
            isValid = false;
            citizenCardInput.style.borderColor = '#dc2626';
            alert('O número de cartão de cidadão deve ter 9 dígitos.');
        }

        // Validate phone number
        const phoneValue = phoneInput.value;
        if (phoneValue && phoneValue.length !== 9) {
            isValid = false;
            phoneInput.style.borderColor = '#dc2626';
            alert('O número de telemóvel deve ter 9 dígitos.');
        }

        if (!isValid) {
            e.preventDefault();
        }
    });

    // Auto-focus on first field
    document.getElementById('fullName').focus();

    // Real-time validation feedback
    const inputs = registerForm.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#16a34a';
            } else {
                this.style.borderColor = '#dc2626';
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '';
        });
    });
});