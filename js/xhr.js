class allData {

	getData() {
	    return fetch('https://shfe-diplom.neto-server.ru/alldata')
	    	.then(response => response.json())
	    	.then(data => this.info = data.result)
	    	.catch(error => {
	    		console.error('Ошибка при загрузке данных:', error);
	    		alert('Ошибка при загрузке данных. Попробуйте обновить страницу.');
	    	})
  	}

	getSeanceConfig (seanceId) {
		return fetch( `https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${chosenDate}` )
	    .then( response => response.json())
	    .then(data => {
	    	this.hallConfig = data.result;
	    })
	    .catch(error => {
	    	console.error('Ошибка при загрузке конфигурации зала:', error);
	    	alert('Ошибка при загрузке конфигурации зала.');
	    })
	}

	setTicket(params) {
		return fetch('https://shfe-diplom.neto-server.ru/ticket', {

			method: 'POST',

			body: params
		})
			.then(response => response.json())
			.then(data => {
				console.log(data)
				renderTicket();

			})
			.catch(error => {
				console.error('Ошибка при покупке билета:', error);
				alert('Ошибка при покупке билета. Попробуйте еще раз.');
			})
	}

	addHall() {
		fetch( 'https://shfe-diplom.neto-server.ru/hall', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				hallName: hallName.value
			})
		})
		    .then( (response) => response.json())
		    .then( (data) => {
		    	hallName.value = '';
		    	addHallPopup.classList.add('visually-hidden');
		    	this.info.halls = data.result.halls;
		    	hallItems = this.info.halls;
				
		    	renderHallsList(this.info.halls);
		    	renderSessionsList(this.info.halls, this.info.seances);
		    	// Обновляем селекты в других секциях
		    	renderHallSwitch (document.querySelector('.hallSelectorConfig'), this.info.halls);
		    	renderHallSwitch (document.querySelector('.hallSelectorPrices'), this.info.halls);
		    	renderHallSwitch (document.querySelector('.hallSelectorSales'), this.info.halls);
		    });
			
	}

	
	deleteHall(hallId) {
		fetch( `https://shfe-diplom.neto-server.ru/hall/${hallId}`, {
	    			method: 'DELETE',
				})
			    .then( response => response.json())
			    .then( data => {
			    	this.info.halls = data.result.halls;
			    	this.info.seances = data.result.seances;
			    	hallItems = this.info.halls;
			    	seanceItems = this.info.seances;
					
			    	renderHallsList(this.info.halls);
			    	renderSessionsList(this.info.halls, this.info.seances);
			    	// Обновляем селекты в других секциях
			    	renderHallSwitch (document.querySelector('.hallSelectorConfig'), this.info.halls);
			    	renderHallSwitch (document.querySelector('.hallSelectorPrices'), this.info.halls);
			    	renderHallSwitch (document.querySelector('.hallSelectorSales'), this.info.halls);
				});	
	}


	saveConfig(params) {
		fetch(`https://shfe-diplom.neto-server.ru/hall/${configActiveHall.id}`, {
			method: 'POST',
			body: params
		})
			.then( response => response.json())
		    .then( data => {
		    	console.log(data);
		    	this.info.halls.find(x => x.id == data.result.id).hall_config = data.result.hall_config;
		    })
		    .catch(error => {
		    	console.error('Ошибка при сохранении конфигурации зала:', error);
		    	alert('Ошибка при сохранении конфигурации зала.');
		    })
	}

	savePrices(params) {
		fetch(`https://shfe-diplom.neto-server.ru/price/${pricesActiveHall.id}`, {
			method: 'POST',
			body: params
		})
			.then( response => response.json())
		    .then( data => {
		    	console.log( data );
		    	this.info.halls.find(x => x.id == data.result.id).hall_price_standart = data.result.hall_price_standart;
		    	this.info.halls.find(x => x.id == data.result.id).hall_price_vip = data.result.hall_price_vip;
		    })
		    .catch(error => {
		    	console.error('Ошибка при сохранении цен:', error);
		    	alert('Ошибка при сохранении цен.');
		    })
	}

	addFilm(params) {
		fetch( 'https://shfe-diplom.neto-server.ru/film', {
			method: 'POST',

			body: params
		})
		    .then( (response) => response.json())
		    .then( (data) => {
		    	console.log(data);

		    	filmNameInput.value = '';
				filmLengthInput.value = '';
				filmDescInput.value = '';
				filmCountryInput.value = '';
				uploadPosterButton.value = '';

		    	addFilmPopup.classList.toggle('visually-hidden');

		    	this.info.films = data.result.films;
		    	filmItems = this.info.films;

		    	renderFilmsList(this.info.films);
		    })
		    .catch((error) => {
		    	console.error('Ошибка при добавлении фильма:', error);
		    	alert('Произошла ошибка при добавлении фильма. Попробуйте еще раз.');
		    })
	}	
	
	deleteFilm(filmId) {
		fetch( `https://shfe-diplom.neto-server.ru/film/${filmId}`, {
	    			method: 'DELETE',
		})
		    .then( response => response.json())
		    .then( data => {
		    	console.log( data );

		    	this.info.films = data.result.films;
		    	this.info.seances = data.result.seances;
		    	filmItems = this.info.films;
		    	seanceItems = this.info.seances;

		    	renderFilmsList(this.info.films);
		    	renderSessionsList(this.info.halls, this.info.seances);
			});
	}

	addSession(params) {
		fetch( 'https://shfe-diplom.neto-server.ru/seance', {
			method: 'POST',
			body: params
		})
			.then( (response) => response.json())
			.then( (data) => {
				console.log(data)
				if (data.success === false && data.error) {
					alert(data.error);
					return;
				}
				if (data.success) {
					timeInput.value = '10:00';
					addSessionPopup.classList.toggle('visually-hidden');
					this.info.seances = data.result.seances;
					renderSessionsList(this.info.halls, this.info.seances);
				}
			})
			.catch((error) => {
				console.error('Ошибка при добавлении сеанса:', error);
				alert('Произошла ошибка при добавлении сеанса. Попробуйте еще раз.');
			})
	}

	deleteSession(transferData) {
		fetch( `https://shfe-diplom.neto-server.ru/seance/${transferData}`, {
			method: 'DELETE',
			})
			    .then( response => response.json())
			    .then( data => {
			    	console.log( data );

			    	this.info.seances = data.result.seances;
			    	seanceItems = this.info.seances;

			    	renderSessionsList(this.info.halls, this.info.seances);
				});
	}

	openHall(hall, params) {
		fetch( `https://shfe-diplom.neto-server.ru/open/${hall.id}`, {
			method: 'POST',
		body: params 
	})
	    .then( response => response.json())
	    .then( data => {
	    	console.log(data.result.halls);

	    	this.info.halls = data.result.halls;
	    	hallItems = this.info.halls;

	    	launchInfo(hall.id);
	    })
	    .catch(error => {
	    	console.error('Ошибка при открытии/закрытии зала:', error);
	    	alert('Ошибка при открытии/закрытии зала.');
	    });
	}
}