const pricesConfirm = document.querySelector('.prices__save-button');
const pricesCancel = document.querySelector('.prices__cancel-button');
const inputPriceStandart = document.getElementById('default-price');
const inputPriceVip = document.getElementById('vip-price');

let hallPrices = [];
let pricesActiveHall;

function getHallPrices (hall) {
	pricesActiveHall = hallItems.find(x => x.id === hall);
	hallPrices = [pricesActiveHall.hall_price_standart, pricesActiveHall.hall_price_vip];
	renderHallPrices();
	priceInput();
}

function renderHallPrices () {
	inputPriceStandart.value = hallPrices[0];
	inputPriceVip.value = hallPrices[1];
}

function priceInput () {
	inputPriceStandart.addEventListener('input', (e) => {
		const value = e.target.value;
		if (value && Number(value) < 1) {
			e.target.value = '';
			alert('Цена не может быть меньше 1 рубля');
			return;
		}
		if (!/\D/.test(value)) {
			hallPrices[0] = value;
		}
	});

	inputPriceVip.addEventListener('input', (e) => {
		const value = e.target.value;
		if (value && Number(value) < 1) {
			e.target.value = '';
			alert('Цена не может быть меньше 1 рубля');
			return;
		}
		if (!/\D/.test(value)) {
			hallPrices[1] = value;
		}
	});
}

function saveHallPrices () {
	const priceStandart = hallPrices[0];
	const priceVip = hallPrices[1];
	if (Number(priceStandart) < 1 || Number(priceVip) < 1) {
		alert('Цена не может быть меньше 1 рубля');
		return;
	}
	const params = new FormData();
	params.set('priceStandart', priceStandart);
	params.set('priceVip', priceVip);
	data.savePrices(params);
}

function cancelHallPrices () {
	getHallPrices(pricesActiveHall.id);
}

pricesConfirm.addEventListener('click', saveHallPrices);
pricesCancel.addEventListener('click', cancelHallPrices)