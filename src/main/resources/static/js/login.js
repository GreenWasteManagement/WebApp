document.addEventListener('DOMContentLoaded', function() {
    const showPasswordCheckbox = document.getElementById('showPassword');
    const passwordInput = document.getElementById('password');
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');

    showPasswordCheckbox.addEventListener('change', function() {
        passwordInput.type = this.checked ? 'text' : 'password';
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return false;
        }

        fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                if (!res.ok) throw new Error('Login inválido');
                return res.json();
            })
            .then(data => {
                localStorage.setItem('jwt_token', data.token);
                window.location.href = '/profile'; // Redireciona após login
            })
            .catch(() => alert('Credenciais inválidas ou erro de servidor.'));
    });

    usernameInput.focus();
});
