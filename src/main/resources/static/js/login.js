document.addEventListener('DOMContentLoaded', function() {
    const showPasswordCheckbox = document.getElementById('showPassword');
    const passwordInput = document.getElementById('password');

    showPasswordCheckbox.addEventListener('change', function() {
        if (this.checked) {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    });

    // Form validation
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');

    loginForm.addEventListener('submit', function(e) {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username || !password) {
            e.preventDefault();
            alert('Por favor, preencha todos os campos.');
            return false;
        }
    });

    // Auto-focus on username field
    usernameInput.focus();
});