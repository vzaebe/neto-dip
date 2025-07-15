const loginButton = document.querySelector('.viewerAuthBtn')

loginButton.addEventListener('click', (e) => {
	e.preventDefault();

	window.open('login.html', '_self')
})

let data = new allData;

const filmCards = document.querySelector('.user-index');
const seanceSeats = document.querySelector('.user-hall');
const paymentWindow = document.querySelector('.payment');

async function renderFilmCards () {
	await data.getData();
	filmCards.innerHTML = "";	
	let filmsInfo = data.info.films;
	let hallsInfo = data.info.halls;
	let seancesInfo = data.info.seances;

	filmsInfo.forEach((element, index) => {
		const filmSeances = []
		const filmHalls = []

		// Собираем сеансы для данного фильма
		seancesInfo.forEach((item) => {
    		const seanceFilm = item.seance_filmid;
    		if (seanceFilm === element.id) {
    			filmSeances.push(item);
    		}
		})

		// Проверяем, есть ли открытые залы с сеансами для данного фильма
		hallsInfo.forEach((item) => {
			if (item.hall_open == 1) {
    			if (filmSeances.some((e) => e.seance_hallid === item.id)) {
    				filmHalls.push(item);
    			}
			}
		})

		// Если нет залов с сеансами, не создаем элемент фильма
		if (filmHalls.length === 0) {
			return;
		}

		const filmArticle = document.createElement('section');
		filmArticle.classList.add('movies-seance');
		filmArticle.id = 'film'+element.id
		filmCards.appendChild(filmArticle);
		filmArticle.insertAdjacentHTML('beforeend',
			`<div class="movie__info">
                <img class="movie__poster" src="${element.film_poster}" alt="Постер фильма">
                <div class="movie__description">
                    <h2 class="movie__name">${element.film_name}</h2>
                    <p class="movie__synopsis">${element.film_description}</p>
                    <div class="movie__data">
                        <span class="movie__time">${element.film_duration}</span>
                        <span class="movie__country">${element.film_origin}</span>
                    </div>
               </div>
            </div> 
			<div class="movie-seance__halls"></div>`
		)

		const filmSchedule = [...document.querySelectorAll('.movie-seance__halls')];
		const currentFilmIndex = filmSchedule.length - 1;

		// Добавляем залы для фильма
		filmHalls.forEach((item) => {
			filmSchedule[currentFilmIndex].insertAdjacentHTML('beforeend',`
				<div class="movie-seance__hall" data-id="${item.id}" data-open="1">
					<h3 class="movie-seance__hall-name">${item.hall_name}</h3>
					<ul class="movie-seance__time-list">
					</ul>
				</div>
			`)
		})

		renderFilmSeances(element, filmSeances);
	});
}

function renderFilmSeances (film, filmSeances) {
	const filmCard = [...document.querySelectorAll('.movies-seance')];
	filmSeances.forEach((element) => {
		const currentFilm = filmCard.find((e) => e.id.slice(4) == element.seance_filmid);
		const currentFilmHalls = [...currentFilm.children.item(1).children];
		const currentHall = currentFilmHalls.find((e) => e.dataset.id == element.seance_hallid);
		if (currentHall) {
			const movieTime = document.createElement('li');
			movieTime.classList.add('movie-seance__time-item');
			if (chosenDate == todayDateString) {
				const time = new Date();
				const timeString = `${String(time.getHours()).padStart(2, '0')}${String(time.getMinutes()).padStart(2, '0')}`
				if (timeString > element.seance_time.replace(':', '')) {
					movieTime.classList.add('movie-seance__time-item_disabled')
				}
			} else if (chosenDate < todayDateString) {
				// Прошедшие даты - неактивны
				movieTime.classList.add('movie-seance__time-item_disabled')
			}
			movieTime.setAttribute('data-time', element.seance_time.replace(':', ''))
			movieTime.textContent = element.seance_time;

			if (![...movieTime.classList].includes('movie-seance__time-item_disabled')) {
				movieTime.addEventListener('click', e => {
					window.localStorage.setItem('seanceId', element.id);
					window.localStorage.setItem('seanceHallId', element.seance_hallid);
					window.localStorage.setItem('seanceTime', element.seance_time);
					window.localStorage.setItem('filmTitle', film.film_name);
					window.localStorage.setItem('chosenDate', chosenDate);
					console.log(window.localStorage.getItem('seanceId'))
					window.open('hall.html', '_self');
				})
			}

			currentHall.children.item(1).appendChild(movieTime);
		};
	})

	const hallTimes = [...document.querySelectorAll('.movie-seance__time-list')];
	hallTimes.forEach(element => {
		const hallTime = [...element.children]
		hallTime.sort((a,b) => {
			return a.dataset.time - b.dataset.time
		})

		hallTime.forEach(item => {
			element.appendChild(item);
		})
	})
}