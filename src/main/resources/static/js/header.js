(function () {
    // Check if a JWT token is stored (i.e. user is logged in)
    const hasToken = !!localStorage.getItem('jwt_token');

    // Hide the “Login” link when logged in, otherwise show it
    document
        .querySelectorAll('a.nav-link[href="/login"]')
        .forEach(el => el.style.display = hasToken ? 'none' : '');

    // Show the “Profile” link when logged in, otherwise hide it
    document
        .querySelectorAll('a.nav-link[href="/profile"]')
        .forEach(el => el.style.display = hasToken ? '' : 'none');
})();
