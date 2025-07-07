import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import { generateWeekDates, getTodayDateString, isTimePassed } from '../utils/calendar';
import './UserIndex.css';

const UserIndex = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [chosenDate, setChosenDate] = useState(getTodayDateString());
  const [weekDates, setWeekDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setWeekDates(generateWeekDates());
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getData();
      setData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (date) => {
    setChosenDate(date);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSeanceClick = (seance, film) => {
    localStorage.setItem('seanceId', seance.id);
    localStorage.setItem('seanceHallId', seance.seance_hallid);
    localStorage.setItem('seanceTime', seance.seance_time);
    localStorage.setItem('filmTitle', film.film_name);
    localStorage.setItem('chosenDate', chosenDate);
    navigate('/hall');
  };

  const renderFilmCards = () => {
    if (!data || !data.films) return null;

    return data.films.map((film) => {
      const filmSeances = data.seances.filter(
        (seance) => seance.seance_filmid === film.id
      );

      const filmHalls = data.halls.filter((hall) => {
        if (hall.hall_open === 0) return false;
        return filmSeances.some((seance) => seance.seance_hallid === hall.id);
      });

      if (filmHalls.length === 0) return null;

      return (
        <section key={film.id} className="movies-seance">
          <div className="movie__info">
            <img 
              className="movie__poster" 
              src={film.film_poster} 
              alt="Постер фильма" 
            />
            <div className="movie__description">
              <h2 className="movie__name">{film.film_name}</h2>
              <p className="movie__synopsis">{film.film_description}</p>
              <div className="movie__data">
                <span className="movie__time">{film.film_duration}</span>
                <span className="movie__country">{film.film_origin}</span>
              </div>
            </div>
          </div>
          <div className="movie-seance__halls">
            {filmHalls.map((hall) => {
              const hallSeances = filmSeances.filter(
                (seance) => seance.seance_hallid === hall.id
              );

              return (
                <div key={hall.id} className="movie-seance__hall">
                  <h3 className="movie-seance__hall-name">{hall.hall_name}</h3>
                  <ul className="movie-seance__time-list">
                    {hallSeances
                      .sort((a, b) => a.seance_time.localeCompare(b.seance_time))
                      .map((seance) => {
                        const isDisabled = isTimePassed(seance.seance_time, chosenDate);
                        
                        return (
                          <li
                            key={seance.id}
                            className={`movie-seance__time-item ${
                              isDisabled ? 'movie-seance__time-item_disabled' : ''
                            }`}
                            onClick={() => {
                              if (!isDisabled) {
                                handleSeanceClick(seance, film);
                              }
                            }}
                            title={isDisabled ? 'Сеанс уже прошел' : `Забронировать билет на ${seance.seance_time}`}
                          >
                            {seance.seance_time}
                          </li>
                        );
                      })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      );
    });
  };

  if (loading) {
    return (
      <div className="user">
        <header className="user-header">
          <a href="/" className="logo-link">
            <h1 className="user-header__logo logo">
              идём<span className="logo-letter">в</span>кино
            </h1>
          </a>
          <button className="user-header__button button" onClick={handleLoginClick}>
            войти
          </button>
        </header>
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="user">
      <header className="user-header">
        <a href="/" className="logo-link">
          <h1 className="user-header__logo logo">
            идём<span className="logo-letter">в</span>кино
          </h1>
        </a>
        <button className="user-header__button button" onClick={handleLoginClick}>
          войти
        </button>
      </header>
      
      <nav className="user-nav">
        <ul className="nav__list">
          {weekDates.map((dateInfo) => (
            <li
              key={dateInfo.date}
              className={`nav__item ${
                dateInfo.date === chosenDate ? 'nav__item_active' : ''
              } ${dateInfo.isToday ? 'nav__item-red' : ''}`}
              onClick={() => handleDateClick(dateInfo.date)}
            >
              <span className="date__day">
                {dateInfo.isToday ? 'Сегодня' : dateInfo.display.dayOfWeek}
              </span>
              <span className="date__number">
                {dateInfo.display.day}, {dateInfo.display.month}
              </span>
            </li>
          ))}
        </ul>
      </nav>
      
      <main className="user-index">
        {renderFilmCards()}
      </main>
    </div>
  );
};

export default UserIndex; 