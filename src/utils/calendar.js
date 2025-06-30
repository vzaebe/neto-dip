export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateForDisplay = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const months = [
    'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
  ];
  
  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  
  return { dayOfWeek, day, month };
};

export const generateWeekDates = (startDate = new Date()) => {
  const dates = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    const isToday = dateString === getTodayDateString();
    
    dates.push({
      date: dateString,
      display: formatDateForDisplay(dateString),
      isToday
    });
  }
  
  return dates;
};

export const isTimePassed = (timeString, dateString) => {
  if (dateString !== getTodayDateString()) {
    return false;
  }
  
  const now = new Date();
  const currentTime = `${now.getHours()}${String(now.getMinutes()).padStart(2, '0')}`;
  const seanceTime = timeString.replace(':', '');
  
  return currentTime > seanceTime;
}; 