// import des données works depuis l'api
const reponse = await fetch("http://localhost:5678/api/works")
	.then(function (response) {
		if (response.ok) {
			return response.json();
		}
	})
	// Si réponse ok
	.then(function (data) {
		let works = data;
		console.log(works);
		// Loop
		works.forEach((work, index) => {
			// Creation <figure>
			let myFigure = document.createElement('figure');
			myFigure.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
			myFigure.setAttribute('id', `work-item-${work.id}`);
			// Creation <img>
			let myImg = document.createElement('img');
			myImg.setAttribute('src', work.imageUrl);
			myImg.setAttribute('alt', work.title);
			myFigure.appendChild(myImg);
			// Creation <figcaption>
			let myFigCaption = document.createElement('figcaption');
			myFigCaption.textContent = work.title;
			myFigure.appendChild(myFigCaption);
			// Adding <figure> into div.gallery
			document.querySelector("div.gallery").appendChild(myFigure);
		});
	})
	// Si la réponse n'est pas valide
	.catch(function (err) {
		console.log(err);
	});

// Récupération des Catégories
fetch("http://localhost:5678/api/categories")
	.then(function getcategories(response) {
		if (response.ok) {
			return response.json();
		}
	})

	// Si réponse ok alors
	.then(function (data) {
		let categories = data;
		categories.unshift({ id: 0, name: 'Tous' });
		console.log(categories);
		// Loop
		categories.forEach((category) => {
			// Creation <button>
			let myButton = document.createElement('button');
			myButton.classList.add('work-filter');
			myButton.classList.add('filters-design');
			if (category.id === 0) myButton.classList.add('filter-active', 'filter-all');
			myButton.setAttribute('data-filter', category.id);
			myButton.textContent = category.name;
			// Adding new <button> into div.filters
			document.querySelector("div.filters").appendChild(myButton);
			// Click event <buttton> 
			myButton.addEventListener('click', function (event) {
				event.preventDefault();
				// filter
				document.querySelectorAll('.work-filter').forEach((workFilter) => {
					workFilter.classList.remove('filter-active');
				});
				event.target.classList.add('filter-active');
				//works
				let categoryId = myButton.getAttribute('data-filter');
				document.querySelectorAll('.work-item').forEach(workItem => {
					workItem.style.display = 'none';
				});
				document.querySelectorAll(`.work-item.category-id-${categoryId}`).forEach(workItem => {
					workItem.style.display = 'block';
				});
			});
		});
	})
	// Si réponse incorrecte 
	.catch(function (err) {
		console.log(err);
	});

// Vérifie si l'utilisateur est connecté
function isConnected() {
	// Retourne vrai si le token existe dans le sessionStorage, faux sinon
	return sessionStorage.getItem("token") !== null;
}

// Gère le bouton de connexion/déconnexion en fonction de l'état de connexion
function handleLoginButton() {
	const loginButton = document.querySelector("#login-button");
	if (isConnected()) {
		loginButton.innerText = "logout";
		loginButton.addEventListener("click", () => {
			sessionStorage.removeItem("token");
			window.location.href = "./index.html"; // Redirige vers l'accueil après déconnexion
		});
	} else {
		loginButton.innerText = "login";
		loginButton.addEventListener("click", () => {
			window.location.href = "./login.html"; // Redirige vers la page de connexion
		});
	}
}
// Affiche ou cache les éléments administratifs en fonction de l'état de connexion
function handleAdminElements() {
	const adminElements = document.querySelectorAll(".admin-element");
	if (isConnected()) {
		adminElements.forEach((element) => {
			element.classList.remove("hidden"); // Affiche les éléments
		});
	} else {
		adminElements.forEach((element) => {
			element.classList.add("hidden"); // Cache les éléments
		});
	}
}

// Ajuste l'affichage de certains éléments du DOM en fonction de l'état de connexion
function adjustDisplayBasedOnLogin() {
	const loggedIn = isConnected();
	const headerEdit = document.getElementById("header-edit");
	const editWorks = document.getElementById("edit-works");
	const filterContainer = document.getElementById("filter-container");

	// Si l'utilisateur est connecté, affiche les éléments d'édition et masque le conteneur de filtres
	if (loggedIn) {
		headerEdit.style.display = "flex";
		editWorks.style.display = "block";
		filterContainer.style.display = "none";
	} else {
		// Sinon, masque les éléments d'édition et affiche le conteneur de filtres
		headerEdit.style.display = "none";
		editWorks.style.display = "none";
		filterContainer.style.display = "flex";
	}
}

// Initialisation des fonctions liées à la connexion et l'affichage lors du chargement de la page
document.addEventListener("DOMContentLoaded", () => {
	adjustDisplayBasedOnLogin();
	handleLoginButton();
});

// Fonction principale qui initialise toutes les autres au chargement de la page
(function main() {
	handleLoginButton();
	displayFilteredWorks();
	displayCategories();
	handleAdminElements();
})();