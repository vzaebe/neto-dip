import React, { useEffect, useState } from 'react';
import apiService from '../services/api';
import './UserIndex.css';

const initialHallConfig = (rows = 5, seats = 8) =>
  Array.from({ length: rows }, () => Array(seats).fill('standart'));

const AdminPanel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Halls
  const [showAddHall, setShowAddHall] = useState(false);
  const [newHallName, setNewHallName] = useState('');
  const [activeHallId, setActiveHallId] = useState(null);
  const [hallRows, setHallRows] = useState(5);
  const [hallSeats, setHallSeats] = useState(8);
  const [hallConfig, setHallConfig] = useState(initialHallConfig());

  // Films
  const [showAddFilm, setShowAddFilm] = useState(false);
  const [newFilm, setNewFilm] = useState({ name: '', duration: '', description: '', origin: '', poster: '' });

  // Prices
  const [activePriceHallId, setActivePriceHallId] = useState(null);
  const [priceStandart, setPriceStandart] = useState('');
  const [priceVip, setPriceVip] = useState('');

  // Seances
  const [showAddSeance, setShowAddSeance] = useState(false);
  const [newSeance, setNewSeance] = useState({ filmId: '', hallId: '', time: '10:00' });

  // Sales
  const [activeSalesHallId, setActiveSalesHallId] = useState(null);

  // Drag & Drop
  const [draggedFilm, setDraggedFilm] = useState(null);
  const [draggedSeance, setDraggedSeance] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await apiService.getData();
      setData(result);
    } catch (e) {
      setError('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  // Halls
  const handleAddHall = async () => {
    if (!newHallName.trim()) return;
    await apiService.addHall(newHallName);
    setShowAddHall(false);
    setNewHallName('');
    fetchData();
  };
  const handleDeleteHall = async (id) => {
    await apiService.deleteHall(id);
    fetchData();
  };
  const handleSelectHallConfig = (id) => {
    setActiveHallId(id);
    const hall = data.halls.find(h => h.id === id);
    if (hall && hall.hall_config) {
      setHallConfig(hall.hall_config);
      setHallRows(hall.hall_config.length);
      setHallSeats(hall.hall_config[0]?.length || 8);
    } else {
      setHallConfig(initialHallConfig());
      setHallRows(5);
      setHallSeats(8);
    }
  };
  const handleChangeHallConfig = (rowIdx, seatIdx) => {
    setHallConfig(prev => prev.map((row, r) =>
      row.map((seat, s) => {
        if (r === rowIdx && s === seatIdx) {
          if (seat === 'standart') return 'vip';
          if (seat === 'vip') return 'disabled';
          if (seat === 'disabled') return 'standart';
        }
        return seat;
      })
    ));
  };
  const handleSaveHallConfig = async () => {
    const params = new FormData();
    params.append('hallConfig', JSON.stringify(hallConfig));
    await apiService.saveConfig(activeHallId, params);
    fetchData();
  };

  // Films
  const handleAddFilm = async () => {
    const params = new FormData();
    params.append('filmName', newFilm.name);
    params.append('filmDuration', newFilm.duration);
    params.append('filmDescription', newFilm.description);
    params.append('filmOrigin', newFilm.origin);
    // params.append('filePoster', newFilm.poster); // file upload
    await apiService.addFilm(params);
    setShowAddFilm(false);
    setNewFilm({ name: '', duration: '', description: '', origin: '', poster: '' });
    fetchData();
  };
  const handleDeleteFilm = async (id) => {
    await apiService.deleteFilm(id);
    fetchData();
  };

  // Prices
  const handleSelectPriceHall = (id) => {
    setActivePriceHallId(id);
    const hall = data.halls.find(h => h.id === id);
    setPriceStandart(hall.hall_price_standart || '');
    setPriceVip(hall.hall_price_vip || '');
  };
  const handleSavePrices = async () => {
    const params = new FormData();
    params.append('priceStandart', priceStandart);
    params.append('priceVip', priceVip);
    await apiService.savePrices(activePriceHallId, params);
    fetchData();
  };

  // Seances
  const handleAddSeance = async () => {
    const params = new FormData();
    params.append('seanceFilmid', newSeance.filmId);
    params.append('seanceHallid', newSeance.hallId);
    params.append('seanceTime', newSeance.time);
    await apiService.addSession(params);
    setShowAddSeance(false);
    setNewSeance({ filmId: '', hallId: '', time: '10:00' });
    fetchData();
  };
  const handleDeleteSeance = async (id) => {
    await apiService.deleteSession(id);
    fetchData();
  };

  // Sales
  const handleOpenSales = async () => {
    const params = new FormData();
    const hall = data.halls.find(h => h.id === activeSalesHallId);
    const newOpenStatus = hall.hall_open === 1 ? 0 : 1;
    params.append('open', newOpenStatus);
    await apiService.openHall(activeSalesHallId, params);
    fetchData();
  };

  // Drag & Drop handlers
  const handleFilmDragStart = (e, film) => {
    setDraggedFilm(film);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleFilmDragEnd = () => {
    setDraggedFilm(null);
  };

  const handleTimelineDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleTimelineDrop = async (e, hallId) => {
    e.preventDefault();
    if (!draggedFilm) return;

    // Создаем сеанс для выбранного времени
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const timeIndex = Math.floor(x / (rect.width / 24)); // 24 часа
    const hours = Math.max(0, Math.min(23, timeIndex));
    const time = `${String(hours).padStart(2, '0')}:00`;

    const params = new FormData();
    params.append('seanceFilmid', draggedFilm.id);
    params.append('seanceHallid', hallId);
    params.append('seanceTime', time);
    
    try {
      await apiService.addSession(params);
      fetchData();
    } catch (error) {
      console.error('Error adding seance:', error);
    }
  };

  const handleSeanceDragStart = (e, seance) => {
    setDraggedSeance(seance);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSeanceDragEnd = () => {
    setDraggedSeance(null);
  };

  const handleDeleteAreaDrop = async (e) => {
    e.preventDefault();
    if (!draggedSeance) return;

    try {
      await apiService.deleteSession(draggedSeance.id);
      fetchData();
    } catch (error) {
      console.error('Error deleting seance:', error);
    }
  };

  if (loading) return <div className="admin">Загрузка...</div>;
  if (error) return <div className="admin">{error}</div>;
  if (!data) return null;

  return (
    <div className="admin">
      <header className="admin-header">
        <h1 className="admin-header__logo logo">идём<span className="logo-letter">в</span>кино</h1>
        <p className="admin-header__text">Администраторррская</p>
      </header>
      <main className="manage">
        {/* Управление залами */}
        <section className="halls">
          <header className="section__header">
            <h2 className="section__title">Управление залами</h2>
            <button className="section__header-button" onClick={() => setShowAddHall(true)} />
          </header>
          <div className="halls__content manage__content">
            <p className="halls__text">Доступные залы:</p>
            <ul className="halls__list">
              {data.halls.map(hall => (
                <li className="halls__item" key={hall.id}>
                  {hall.hall_name}
                  <button className="halls__item-delete" onClick={() => handleDeleteHall(hall.id)} />
                </li>
              ))}
            </ul>
            <button className="halls__add-button button" onClick={() => setShowAddHall(true)}>Создать зал</button>
            {showAddHall && (
              <div className="popup-wrapper">
                <div className="popup">
                  <header className="popup__header">
                    <h2 className="popup__title">Добавление зала</h2>
                    <span className="popup__close" onClick={() => setShowAddHall(false)} />
                  </header>
                  <form className="popup__form" onSubmit={e => {e.preventDefault(); handleAddHall();}}>
                    <label className="popup__label">Название зала</label>
                    <input className="popup__input" value={newHallName} onChange={e => setNewHallName(e.target.value)} required />
                    <div className="popup__buttons">
                      <button className="popup__add button" type="submit">Добавить</button>
                      <button className="popup__cancel button" type="button" onClick={() => setShowAddHall(false)}>Отменить</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* Конфигурация зала */}
        <section className="config-hall">
          <header className="section__header">
            <h2 className="section__title">Конфигурация залов</h2>
          </header>
          <div className="config-hall__content manage__content">
            <div className="select-hall">
              <p className="select-hall__text">Выберете зал для конфигурации:</p>
              <ul className="select-hall__list select-hall__list-config">
                {data.halls.map(hall => (
                  <li
                    key={hall.id}
                    className={`select-hall__item${activeHallId === hall.id ? ' select-hall__item_selected' : ''}`}
                    onClick={() => handleSelectHallConfig(hall.id)}
                  >
                    {hall.hall_name}
                  </li>
                ))}
              </ul>
            </div>
            {activeHallId && (
              <div className="config-seat">
                <p className="config-seat__text">Укажите количество рядов и максимальное количество кресел в ряду:</p>
                <form className="config-seat__form" onSubmit={e => {e.preventDefault(); setHallConfig(initialHallConfig(hallRows, hallSeats));}}>
                  <div>
                    <label className="config-seat__label">Рядов, шт</label>
                    <input className="config-seat__input" type="number" min="1" value={hallRows} onChange={e => setHallRows(Number(e.target.value))} />
                  </div>
                  <span className="config-seat__form-cross">x</span>
                  <div>
                    <label className="config-seat__label">Мест, шт</label>
                    <input className="config-seat__input" type="number" min="1" value={hallSeats} onChange={e => setHallSeats(Number(e.target.value))} />
                  </div>
                  <button className="button" type="submit">Обновить схему</button>
                </form>
              </div>
            )}
            {activeHallId && (
              <div className="hall">
                <p className="hall__text">Теперь вы можете указать типы кресел на схеме зала:</p>
                <div className="hall__info">
                  <div className="seats-info"><span className="standart seat" /> — обычные кресла </div>
                  <div className="seats-info"><span className="vip seat" /> — VIP кресла </div>
                  <div className="seats-info"><span className="disabled-seat seat" /> — заблокированные (нет кресла)</div>
                </div>
                <p className="hall__hint">Чтобы изменить вид кресла, нажмите по нему левой кнопкой мыши</p>
                <div className="hall__scheme">
                  <h3 className="hall__screen">экран</h3>
                  <div className="hall__scheme-grid">
                    {hallConfig.map((row, rowIdx) => (
                      <div key={rowIdx} style={{display: 'flex'}}>
                        {row.map((seat, seatIdx) => {
                          let seatClass = 'seat ';
                          if (seat === 'vip') seatClass += 'vip';
                          else if (seat === 'standart') seatClass += 'standart';
                          else seatClass += 'disabled-seat';
                          return (
                            <div
                              key={seatIdx}
                              className={seatClass}
                              onClick={() => handleChangeHallConfig(rowIdx, seatIdx)}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="manage__changes-btn">
                  <button className="config__save-button save-button button" onClick={handleSaveHallConfig}>Сохранить</button>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* Конфигурация цен */}
        <section className="prices">
          <header className="section__header">
            <h2 className="section__title">Конфигурация цен</h2>
          </header>
          <div className="prices__content manage__content">
            <div className="select-hall">
              <p className="select-hall__text">Выберете зал для конфигурации:</p>
              <ul className="select-hall__list select-hall__list-prices">
                {data.halls.map(hall => (
                  <li
                    key={hall.id}
                    className={`select-hall__item${activePriceHallId === hall.id ? ' select-hall__item_selected' : ''}`}
                    onClick={() => handleSelectPriceHall(hall.id)}
                  >
                    {hall.hall_name}
                  </li>
                ))}
              </ul>
            </div>
            {activePriceHallId && (
              <div className="prices__config">
                <p className="prices__config-text">Установите цены для типов кресел:</p>
                <form className="prices__form" onSubmit={e => {e.preventDefault(); handleSavePrices();}}>
                  <div className="prices__set">
                    <div>
                      <label className="prices__set-label">Цена, рублей</label>
                      <input className="prices__set-input" type="number" value={priceStandart} onChange={e => setPriceStandart(e.target.value)} />
                    </div>
                    <span className="prices__set-text">за <span className="standart" /> обычные кресла</span>
                  </div>
                  <div className="prices__set">
                    <div>
                      <label className="prices__set-label">Цена, рублей</label>
                      <input className="prices__set-input" type="number" value={priceVip} onChange={e => setPriceVip(e.target.value)} />
                    </div>
                    <span className="prices__set-text">за <span className="vip" /> VIP кресла</span>
                  </div>
                  <div className="manage__changes-btn">
                    <button className="save-button prices__save-button button" type="submit">Сохранить</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
        {/* Сетка сеансов */}
        <section className="sessions">
          <header className="section__header">
            <h2 className="section__title">Сетка сеансов</h2>
            <button className="section__header-button" onClick={() => setShowAddFilm(true)} />
          </header>
          <div className="sessions__content manage__content">
            <button className="sessions__add button" onClick={() => setShowAddFilm(true)}>Добавить фильм</button>
            <ul className="admin-movie__list">
              {data.films.map(film => (
                <li 
                  className="admin-movie" 
                  key={film.id}
                  draggable
                  onDragStart={(e) => handleFilmDragStart(e, film)}
                  onDragEnd={handleFilmDragEnd}
                >
                  <img className="admin-movie__poster" src={film.film_poster} alt="постер фильма" />
                  <div className="admin-movie__info">
                    <h3 className="admin-movie__name">{film.film_name}</h3>
                    <span className="admin-movie__duration">{film.film_duration}</span>
                    <button className="admin-movie__delete-btn" onClick={() => handleDeleteFilm(film.id)} />
                  </div>
                </li>
              ))}
            </ul>
            <ul className="seances__hall-list">
              {data.halls.map(hall => (
                <li className="seances__hall" key={hall.id}>
                  <div className="seances__hall-title">{hall.hall_name}</div>
                  <div 
                    className="seances__timeline"
                    onDragOver={handleTimelineDragOver}
                    onDrop={(e) => handleTimelineDrop(e, hall.id)}
                  >
                    {data.seances.filter(s => s.seance_hallid === hall.id).map(seance => {
                      const film = data.films.find(f => f.id === seance.seance_filmid);
                      return (
                        <div 
                          className="seance" 
                          key={seance.id}
                          draggable
                          onDragStart={(e) => handleSeanceDragStart(e, seance)}
                          onDragEnd={handleSeanceDragEnd}
                        >
                          <div className="seance__wrapper">
                            <span className="seance__name">{film?.film_name}</span>
                            <span className="seance__start">{seance.seance_time}</span>
                            <button className="seance-delete" onClick={() => handleDeleteSeance(seance.id)} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
            {/* Область для удаления сеансов */}
            <div 
              className="delete-area"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDeleteAreaDrop}
              style={{
                height: '50px',
                border: '2px dashed #ff4444',
                margin: '20px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ff4444',
                backgroundColor: 'rgba(255, 68, 68, 0.1)'
              }}
            >
              Перетащите сеанс сюда для удаления
            </div>
            {showAddFilm && (
              <div className="popup-wrapper">
                <div className="popup">
                  <header className="popup__header">
                    <h2 className="popup__title">Добавление фильма</h2>
                    <span className="popup__close" onClick={() => setShowAddFilm(false)} />
                  </header>
                  <form className="popup__form" onSubmit={e => {e.preventDefault(); handleAddFilm();}}>
                    <label className="popup__label">Название фильма</label>
                    <input className="popup__input" value={newFilm.name} onChange={e => setNewFilm(f => ({...f, name: e.target.value}))} required />
                    <label className="popup__label">Продолжительность фильма (мин.)</label>
                    <input className="popup__input" type="number" value={newFilm.duration} onChange={e => setNewFilm(f => ({...f, duration: e.target.value}))} required />
                    <label className="popup__label">Описание фильма</label>
                    <textarea className="popup__textarea" value={newFilm.description} onChange={e => setNewFilm(f => ({...f, description: e.target.value}))} required />
                    <label className="popup__label">Страна</label>
                    <input className="popup__input" value={newFilm.origin} onChange={e => setNewFilm(f => ({...f, origin: e.target.value}))} required />
                    <div className="popup__buttons">
                      <button className="popup__add button" type="submit">Добавить фильм</button>
                      <button className="popup__cancel button" type="button" onClick={() => setShowAddFilm(false)}>Отменить</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {showAddSeance && (
              <div className="popup-wrapper">
                <div className="popup">
                  <header className="popup__header">
                    <h2 className="popup__title">Добавление сеанса</h2>
                    <span className="popup__close" onClick={() => setShowAddSeance(false)} />
                  </header>
                  <form className="popup__form" onSubmit={e => {e.preventDefault(); handleAddSeance();}}>
                    <label className="popup__label">Фильм</label>
                    <select className="popup__select" value={newSeance.filmId} onChange={e => setNewSeance(s => ({...s, filmId: e.target.value}))} required>
                      <option value="">Выберите фильм</option>
                      {data.films.map(film => (
                        <option key={film.id} value={film.id}>{film.film_name}</option>
                      ))}
                    </select>
                    <label className="popup__label">Зал</label>
                    <select className="popup__select" value={newSeance.hallId} onChange={e => setNewSeance(s => ({...s, hallId: e.target.value}))} required>
                      <option value="">Выберите зал</option>
                      {data.halls.map(hall => (
                        <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
                      ))}
                    </select>
                    <label className="popup__label">Время</label>
                    <input className="popup__input" type="time" value={newSeance.time} onChange={e => setNewSeance(s => ({...s, time: e.target.value}))} required />
                    <div className="popup__buttons">
                      <button className="popup__add button" type="submit">Добавить сеанс</button>
                      <button className="popup__cancel button" type="button" onClick={() => setShowAddSeance(false)}>Отменить</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </section>
        {/* Открыть продажи */}
        <section className="sales">
          <header className="section__header sales__header">
            <h2 className="section__title">Открыть продажи</h2>
          </header>
          <div className="sales__content manage__content">
            <div className="select-hall">
              <p className="select-hall__text">Выбирите зал для открытия/закрытия продаж:</p>
              <ul className="select-hall__list select-hall__list-sales">
                {data.halls.map(hall => (
                  <li
                    key={hall.id}
                    className={`select-hall__item${activeSalesHallId === hall.id ? ' select-hall__item_selected' : ''}`}
                    onClick={() => setActiveSalesHallId(hall.id)}
                  >
                    {hall.hall_name}
                  </li>
                ))}
              </ul>
            </div>
            {activeSalesHallId && (
              <>
                <p className="sales__text">
                  {data.halls.find(h => h.id === activeSalesHallId)?.hall_open === 1 
                    ? 'Продажи открыты' 
                    : 'Продажи закрыты'
                  }
                </p>
                <button 
                  className="button sales__button" 
                  onClick={handleOpenSales} 
                  disabled={!activeSalesHallId}
                >
                  {data.halls.find(h => h.id === activeSalesHallId)?.hall_open === 1 
                    ? 'Приостановить продажу билетов' 
                    : 'Открыть продажу билетов'
                  }
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPanel; 