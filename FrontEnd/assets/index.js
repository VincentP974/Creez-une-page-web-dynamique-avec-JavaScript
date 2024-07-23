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

	// Check if the token and userId are present in the localStorage
	if (localStorage.getItem('token') != null && localStorage.getItem('userId') != null) {
		// Change the visual of the page in admin mode
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

	// Click logout to disconnect
	document.getElementById('nav-logout').addEventListener('click', function (event) {
		event.preventDefault();
		localStorage.removeItem('userId');
		localStorage.removeItem('token');
		// Changing the page visual when the administrator is disconnected
		document.querySelector('body').classList.remove(`connected`);
		let topBar = document.getElementById('top-bar');
		topBar.style.display = "none";
		let filters = document.getElementById('all-filters');
		filters.style.display = "flex";
		let space = document.getElementById('space-only-admin');
		space.style.paddingBottom = "0";
	});

	// ouverture modale avec boutton modifier en mode admin
	document.getElementById('update-works').addEventListener('click', function (event) {
		event.preventDefault();
		// New fetch to add all works in the work modal
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
				// Looping on each work
				works.forEach((work, index) => {
					// Creation <figure>
					let myFigure = document.createElement('figure');
					myFigure.setAttribute('class', `work-item category-id-0 category-id-${work.categoryId}`);
					myFigure.setAttribute('id', `work-item-popup-${work.id}`);
					// Creation <img>
					let myImg = document.createElement('img');
					myImg.setAttribute('src', work.imageUrl);
					myImg.setAttribute('alt', work.title);
					myFigure.appendChild(myImg);
					// Creation <figcaption>
					let myFigCaption = document.createElement('figcaption');
					myFigCaption.textContent = 'éditer';
					myFigure.appendChild(myFigCaption);
					// Creation cross icon
					let crossDragDrop = document.createElement('i');
					crossDragDrop.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'cross');
					myFigure.appendChild(crossDragDrop);
					// Creation trash icon
					let trashIcon = document.createElement('i');
					trashIcon.classList.add('fa-solid', 'fa-trash-can', 'trash');
					myFigure.appendChild(trashIcon);

					// gestion de la suppression d'un élément
					trashIcon.addEventListener('click', function (event) {
						event.preventDefault();
						if (confirm("Voulez-vous supprimer cet élément ?")) {
							// Fetch to delete work in the work modal and in the portfolio gallery of the page
							fetch(`http://localhost:5678/api/works/${work.id}`, {
								method: 'DELETE',
								headers: {
									'Content-Type': 'application/json',
									'Authorization': 'Bearer ' + localStorage.getItem('token')
								}
							})
								.then(function (response) {
									switch (response.status) {
										case 500:
										case 503:
											alert("Comportement inattendu!");
											break;
										case 401:
											alert("Suppresion impossible!");
											break;
										case 200:
										case 204:
											console.log("Projet supprimé.");
											// Deleting work from the page
											document.getElementById(`work-item-${work.id}`).remove();
											console.log(`work-item-${work.id}`);
											// Deleting work from the popup
											document.getElementById(`work-item-popup-${work.id}`).remove();
											console.log(`work-item-popup-${work.id}`);
											break;
										default:
											alert("Erreur inconnue!");
											break;
									}
								})
								.catch(function (err) {
									console.log(err);
								});
						}
					});
					// Adding the new <figure> into the existing div.modal-content
					document.querySelector("div.modal-content").appendChild(myFigure);
					// Opening work modal 
					let modal = document.getElementById('modal');
					modal.style.display = "flex";
					let modalWorks = document.getElementById('modal-works');
					modalWorks.style.display = "block";
				});
			})
			.catch(function (err) {
				console.log(err);
			});
	});
	// Gestion de la fermeture de la modale, se ferme quand on clixk a l'estérieur mais pas à l'intérieur 
	document.querySelectorAll('#modal-works').forEach(modalWorks => {
		modalWorks.addEventListener('click', function (event) {
			event.stopPropagation();
		});
		// La modale ne se ferme pas si on clique à l'intérieur 
		document.querySelectorAll('#modal-edit').forEach(modalEdit => {
			modalEdit.addEventListener('click', function (event) {
				event.stopPropagation();
			});
			// fermeture des deux fenêtre modale en cliquant à l'extérieur 
			document.getElementById('modal').addEventListener('click', function (event) {
				event.preventDefault();
				let modal = document.getElementById('modal');
				modal.style.display = "none";
				let modalWorks = document.getElementById('modal-works');
				modalWorks.style.display = "none";
				let modalEdit = document.getElementById('modal-edit');
				modalEdit.style.display = "none";
				// Reset all form in the modal edit 
				// Delete image if existing
				if (document.getElementById('form-image-preview') != null) {
					document.getElementById('form-image-preview').remove();
				}
				// Return to original form design
				document.getElementById('modal-edit-work-form').reset();
				let iconNewPhoto = document.getElementById('photo-add-icon');
				iconNewPhoto.style.display = "block";
				let buttonNewPhoto = document.getElementById('new-image');
				buttonNewPhoto.style.display = "block";
				let photoMaxSize = document.getElementById('photo-size');
				photoMaxSize.style.display = "block";
				let modalEditPhoto = document.getElementById('modal-edit-new-photo');
				modalEditPhoto.style.padding = "30px 0 19px 0";
				document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";
			});
		});
	});

	// Fermeture de la première fenêtre modale avec boutton "x"
	document.getElementById('button-to-close-first-window').addEventListener('click', function (event) {
		event.preventDefault();
		let modal = document.getElementById('modal');
		modal.style.display = "none";
		let modalWorks = document.getElementById('modal-works');
		modalWorks.style.display = "none";
	});

	// Fermeture de la deuxiéme fenêtre modale avec boutton "x"
	document.getElementById('button-to-close-second-window').addEventListener('click', function (event) {
		event.preventDefault();
		let modal = document.getElementById('modal');
		modal.style.display = "none";
		let modalEdit = document.getElementById('modal-edit');
		modalEdit.style.display = "none";
		// Reset all form in the modal edit 
		// Supprime l'image si elle existe
		if (document.getElementById('form-image-preview') != null) {
			document.getElementById('form-image-preview').remove();
		}
		// Return to original form design
		document.getElementById('modal-edit-work-form').reset();
		let iconNewPhoto = document.getElementById('photo-add-icon');
		iconNewPhoto.style.display = "block";
		let buttonNewPhoto = document.getElementById('new-image');
		buttonNewPhoto.style.display = "block";
		let photoMaxSize = document.getElementById('photo-size');
		photoMaxSize.style.display = "block";
		let modalEditPhoto = document.getElementById('modal-edit-new-photo');
		modalEditPhoto.style.padding = "30px 0 19px 0";
		document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";
	});

	// ouverture de la seconde fenêtre modale avec le boutton "Ajouter photo"
	document.getElementById('modal-edit-add').addEventListener('click', function (event) {
		event.preventDefault();
		let modalWorks = document.getElementById('modal-works');
		modalWorks.style.display = "none";
		let modalEdit = document.getElementById('modal-edit');
		modalEdit.style.display = "block";
	});

	// Retour a la première fenêtre de la modal avec le fléche retour
	document.getElementById('arrow-return').addEventListener('click', function (event) {
		event.preventDefault();
		let modalWorks = document.getElementById('modal-works');
		modalWorks.style.display = "block";
		let modalEdit = document.getElementById('modal-edit');
		modalEdit.style.display = "none";
		// Reset all form in the modal edit 
		// Supprime l'image si elle existe
		if (document.getElementById('form-image-preview') != null) {
			document.getElementById('form-image-preview').remove();
		}
		// Return to original form design
		document.getElementById('modal-edit-work-form').reset();
		let iconNewPhoto = document.getElementById('photo-add-icon');
		iconNewPhoto.style.display = "block";
		let buttonNewPhoto = document.getElementById('new-image');
		buttonNewPhoto.style.display = "block";
		let photoMaxSize = document.getElementById('photo-size');
		photoMaxSize.style.display = "block";
		let modalEditPhoto = document.getElementById('modal-edit-new-photo');
		modalEditPhoto.style.padding = "30px 0 19px 0";
		document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";
	});

	// Fetch to add category options in modal edit
	fetch("http://localhost:5678/api/categories")
		.then(function (response) {
			if (response.ok) {
				return response.json();
			}
		})
		.then(function (data) {
			let categories = data;
			// Looping on each categories
			categories.forEach((category, index) => {
				// Creation <options> in modal edit
				let myOption = document.createElement('option');
				myOption.setAttribute('value', category.id);
				myOption.textContent = category.name;
				// Adding the new <option> into the existing select.choice-category
				document.querySelector("select.choice-category").appendChild(myOption);
			});
		})
		.catch(function (err) {
			console.log(err);
		});


});