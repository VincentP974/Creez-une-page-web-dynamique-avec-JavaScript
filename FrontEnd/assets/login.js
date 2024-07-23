// Executing JS code when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('user-login-form').addEventListener('submit', function (event) {
        event.preventDefault();
        // Récupération des valeurs entrées dans email et password
        const user = {
            email: document.querySelector('#email').value,
            password: document.querySelector('#password').value,
        };
        // Envoie d'une requête a l'api pour se connecter
        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user),
        })
