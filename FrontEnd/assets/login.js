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
            .then((response) => {
                if (!response.ok) {
                    // Si le statut de la réponse n'est pas OK (200), lance une erreur
                    throw new Error(
                        "L’authentification a échoué. Veuillez vérifier votre identifiant et votre mot de passe et réessayer."
                    );
                }
                return response.json(); // Analyse le corps de la réponse en tant que JSON
            })
            .then((data) => {
                sessionStorage.setItem("token", data.token); // Stocke le jeton dans le stockage de session
                window.location.href = "./index.html"; // Redirige l'utilisateur vers la page index.html
            })
            .catch((error) => {
                alert("Identifiant ou mot de passe incorrect"); // Affiche une alerte s'il y a une erreur
            });
    })
});