const addFilmPopupButton = document.querySelector('.sessions__add');
const addFilmPopup = document.querySelector('.addfilm');
const addFilmForm = document.querySelector('.addfilm__form');
const filmNameInput = document.getElementById('film-name');
const filmLengthInput = document.getElementById('film-duration');
const filmDescInput = document.getElementById('film-description');
const filmCountryInput = document.getElementById('film-country');
const submitFilmButton = document.querySelector('.addfilm__add-film');
const uploadPosterButton = document.getElementById('add-poster');
const filmsList = document.querySelector('.admin-movie__list');

// Добавляем валидацию для поля продолжительности
filmLengthInput.addEventListener('input', (e) => {
	const value = e.target.value;
	if (value && Number(value) < 1) {
		e.target.value = '';
		alert('Продолжительность фильма не может быть меньше 1 минуты');
	}
});


addFilmPopupButton.addEventListener('click', (e) => {
	addFilmPopup.classList.toggle('visually-hidden');
})

submitFilmButton.addEventListener('click', (e) => {
	e.preventDefault();

	// Валидация формы
	if (!filmNameInput.value.trim()) {
		alert('Введите название фильма');
		return;
	}

	if (!filmLengthInput.value || Number(filmLengthInput.value) < 1) {
		alert('Продолжительность фильма не может быть меньше 1 минуты');
		return;
	}

	if (!filmDescInput.value.trim()) {
		alert('Введите описание фильма');
		return;
	}

	if (!filmCountryInput.value.trim()) {
		alert('Введите страну производства');
		return;
	}

	if (!uploadPosterButton.files[0]) {
		alert('Загрузите постер фильма');
		return;
	}

	const params = new FormData(addFilmForm);

	data.addFilm(params)
})

function renderFilmsList (filmItems) {

	filmsList.innerHTML = "";
	// Очищаем селект фильмов перед добавлением новых
	const filmSelect = document.getElementById('film-names');
	if (filmSelect) {
		filmSelect.innerHTML = "";
	}
	
	filmItems.forEach((element) => {
		filmsList.insertAdjacentHTML('beforeend', 
			`<li class="admin-movie" id="film${element.id}" draggable="true">
				<img class="admin-movie__poster" src="${element.film_poster}" alt="постер фильма">
				<div class="admin-movie__info">
					<h3 class="admin-movie__name">${element.film_name}</h3>
					<span class="admin-movie__duration">${element.film_duration}</span>
					<button class="admin-movie__delete-btn"></button>
				</div>
            </li>`
			)
		if (filmSelect) {
			filmSelect.insertAdjacentHTML('beforeend', `<option value="${element.id}">${element.film_name}</option>`);
		}
	});

	const deleteFilmButton = [...document.querySelectorAll('.admin-movie__delete-btn')];
	const filmCards = [...document.querySelectorAll('.admin-movie')];

	filmCards.forEach((element, index) => {
		element.addEventListener('dragstart', (e) => {	
			console.log('dragstart')				
			dragged = element;
		})

		element.addEventListener('dragend', (e) => {
			dragged = null;
		})
	});

	// Обновляем сессии только если они существуют
	if (hallItems && seanceItems) {
		renderSessionsList(hallItems, seanceItems);
	}
	deleteFilm(deleteFilmButton);

};

function deleteFilm (buttonArray) {
	buttonArray.forEach((element) => {
			element.addEventListener('click', (e) => {
				e.preventDefault();
				const filmId = element.closest('.admin-movie').id.slice(4);

				data.deleteFilm(filmId);				
				})	
		})
}