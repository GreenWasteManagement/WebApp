document.addEventListener('DOMContentLoaded', function () {
    // Toggle password visibility when checkbox changes
    const showPasswordCheckbox = document.getElementById('showPassword');
    const passwordInput = document.getElementById('password');
    showPasswordCheckbox.addEventListener('change', function () {
        passwordInput.type = this.checked ? 'text' : 'password';
    });

    // Handle login form submission
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Trim user inputs
        const email = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate required fields
        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return false;
        }

        // Send login request
        fetch('http://localhost:8080/api/users/login', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email, password})
        })
            .then(res => {
                if (!res.ok) throw new Error('Login inválido');
                return res.json();
            })
            .then(data => {
                // Store token and redirect on success
                localStorage.setItem('jwt_token', data.token);
                window.location.href = '/profile';
            })
            .catch(() => alert('Credenciais inválidas ou erro de servidor.'));
    });

    // Focus the username input on page load
    usernameInput.focus();
});
