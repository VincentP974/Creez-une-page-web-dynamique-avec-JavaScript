// Executing JS code when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('user-login-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // Récupération des valeurs entrées dans email et password
        const user = {
            email: document.querySelector('#email').value,
            password: document.querySelector('#password').value,
        };
