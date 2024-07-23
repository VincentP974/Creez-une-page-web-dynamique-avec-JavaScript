// import des données works depuis l'api
const reponse = await fetch("http://localhost:5678/api/works")
	.then(function getworks(response) {
		if (response.ok) {
			return response.json();
		}
	})
	// Si réponse ok
	.then(function (data) {
		let works = data;
		console.log(works);
		// Loop
		works.forEach((work) => {
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

// fonction destiné a afficher le contenu du dom 
document.addEventListener('DOMContentLoaded', function () {
	// Check token et userId pour vérifier si ils sont bien dans le localStorage
	if (localStorage.getItem('token') != null && localStorage.getItem('userId') != null) {
		//    change le visuel de la page en admin mode
		document.querySelector('body').classList.add('connected');
		let topBar = document.getElementById('top-bar');
		topBar.style.display = "flex";
		let filters = document.getElementById('all-filters');
		filters.style.display = "none";
		let space = document.getElementById('space-only-admin');
		space.style.paddingBottom = "100px";
		let introduction = document.getElementById('space-introduction-in-mode-admin');
		introduction.style.marginTop = "-50px";
	}
	// click logout to disconnect
	document.getElementById('nav-logout').addEventListener('click', function (event) {
		event.preventDefault();
		localStorage.removeItem('userId');
		localStorage.removeItem('token');
		// changement visuelle de la page quand admin est déconnecté
		document.querySelector('body').classList.remove(`connected`);
		let topBar = document.getElementById('top-bar');
		topBar.style.display = "none";
		let filters = document.getElementById('all-filters');
		filters.style.display = "flex";
		let space = document.getElementById('space-only-admin');
		space.style.paddingBottom = "0";
	});
	// ouverture de la modale avec le boutton modifier en admin mode
	document.getElementById('update-works').addEventListener('click', function (event) {
		event.preventDefault();// New fetch to add all works in the work modal
		fetch("http://localhost:5678/api/works")
			.then(function (response) {
				if (response.ok) {
					return response.json();
				}
			})
			.then(function (data) {
				let works = data;
				// Removing old works
				document.querySelector('#modal-works.modal-gallery .modal-content').innerText = '';

			}
