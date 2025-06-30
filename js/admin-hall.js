const addHallPopupButton = document.querySelector('.hallAddBtn');
const addHallPopup = document.querySelector('.addhall');
const addHallForm = document.querySelector('.addhall__form');
const hallName = document.querySelector('.addhall__name');
const submitHallButton = document.querySelector('.addhall__create');
const hallsList = document.querySelector('.hallList');

function renderHallsList (hallsInfo) {
	hallsList.innerHTML = "";
	hallsInfo.forEach((element) => {
		hallsList.insertAdjacentHTML('beforeend', 
			`<li class="hallListItem" id="hall${element.id}">${element.hall_name}
				<button class="hallItemDelete"></button>
			</li>`
			)
	});
	
	const deleteHallButton = [...document.querySelectorAll('.hallItemDelete')];
	deleteHall(deleteHallButton);
	renderHallSwitch (document.querySelector('.hallSelectorConfig'), hallsInfo);
	renderHallSwitch (document.querySelector('.hallSelectorPrices'), hallsInfo);
	renderHallSwitch (document.querySelector('.hallSelectorSales'), hallsInfo);
};

function deleteHall (buttonArray) {
		buttonArray.forEach((element) => {
			element.addEventListener('click', (e) => {
				e.preventDefault();
				const hallId = element.closest('.hallListItem')?.id.slice(4);

				data.deleteHall(hallId);
			});
		})
};

function renderHallSwitch (hallSwitchContainer, hallsInfo) {
	hallSwitchContainer.innerHTML = '';
	hallsInfo.forEach((element) => {
		hallSwitchContainer.insertAdjacentHTML('beforeend', `<li class="hallOption">${element.hall_name}</li>`)
	});
	const hallItemsRendered = [...hallSwitchContainer.children];

	hallItemsRendered[0].classList.add('hallOption--active');

	let activeHallIndex = 0;
	let activeHallName = hallItemsRendered[0].textContent;
	let activeHallId = hallsInfo[0].id;
	if (hallItemsRendered[0].closest('.hallSelectorConfig')) {
		getHallSeats(activeHallId)
	} else if (hallItemsRendered[0].closest('.hallSelectorPrices')) {
		getHallPrices(activeHallId)
	} else if (hallItemsRendered[0].closest('.hallSelectorSales')) {
		launchInfo(activeHallId)
	};

	hallItemsRendered.forEach((element, index) => {
		element.addEventListener('click', (e) => {
			if (index !== activeHallIndex) {
				hallItemsRendered[activeHallIndex].classList.remove('hallOption--active');
				element.classList.add('hallOption--active');
				activeHallIndex = index;
				activeHallName = element.textContent;
				activeHallId = hallsInfo.find(x => x.hall_name === activeHallName).id;
				if (element.closest('.hallSelectorConfig')) {
					inputRows.value = '';
					inputSeats.value = '';
					getHallSeats(activeHallId)
				} else if (element.closest('.hallSelectorPrices')) {
					getHallPrices(activeHallId)
				} else if (element.closest('.hallSelectorSales')) {
					launchInfo(activeHallId)
				};
			}
		})
	})
};

addHallPopupButton.addEventListener('click', (e) => {
	addHallPopup.classList.remove('visually-hidden');
});

submitHallButton.addEventListener('click', (e) => {
	e.preventDefault();

	hallsList.innerHTML = "";

	data.addHall();
});