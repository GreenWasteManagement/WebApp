(function(){
    const hasToken = !!localStorage.getItem('jwt_token');
    document
        .querySelectorAll('a.nav-link[href="/login"]')
        .forEach(el => el.style.display = hasToken ? 'none' : '');
    document
        .querySelectorAll('a.nav-link[href="/profile"]')
        .forEach(el => el.style.display = hasToken ? '' : 'none');
})();