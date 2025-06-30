import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './UserIndex.css';

const Hall = () => {
  const navigate = useNavigate();
  const [hallConfig, setHallConfig] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const seanceId = localStorage.getItem('seanceId');
  const chosenDate = localStorage.getItem('chosenDate');
  const filmTitle = localStorage.getItem('filmTitle');
  const seanceTime = localStorage.getItem('seanceTime');

  useEffect(() => {
    fetchHallConfig();
    // eslint-disable-next-line
  }, []);

  // Пересчитываем общую стоимость при изменении выбранных мест
  useEffect(() => {
    if (hallConfig && selectedSeats.length > 0) {
      let total = 0;
      selectedSeats.forEach(seatKey => {
        const [rowIdx, seatIdx] = seatKey.split('-').map(Number);
        const seatType = hallConfig.hall_config[rowIdx][seatIdx];
        if (seatType === 'vip') {
          total += hallConfig.hall_price_vip || 0;
        } else if (seatType === 'standart') {
          total += hallConfig.hall_price_standart || 0;
        }
      });
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [selectedSeats, hallConfig]);

  const fetchHallConfig = async () => {
    try {
      setLoading(true);
      const config = await apiService.getSeanceConfig(seanceId, chosenDate);
      setHallConfig(config);
    } catch (e) {
      setError('Ошибка загрузки схемы зала');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (rowIdx, seatIdx) => {
    if (!hallConfig) return;
    const seatType = hallConfig.hall_config[rowIdx][seatIdx];
    if (seatType === 'disabled' || seatType === 'busy') return;
    const seatKey = `${rowIdx}-${seatIdx}`;
    setSelectedSeats((prev) =>
      prev.includes(seatKey)
        ? prev.filter((s) => s !== seatKey)
        : [...prev, seatKey]
    );
  };

  const handleReserve = () => {
    // Сохраняем выбранные места и переходим к оплате
    localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    localStorage.setItem('totalPrice', totalPrice.toString());
    navigate('/payment');
  };

  if (loading) {
    return <div className="user-hall">Загрузка схемы зала...</div>;
  }
  if (error) {
    return <div className="user-hall">{error}</div>;
  }
  if (!hallConfig) {
    return <div className="user-hall">Нет данных о зале</div>;
  }
  if (!hallConfig.hall_config) {
    return <div className="user-hall">Ошибка загрузки схемы зала</div>;
  }

  return (
    <div className="user-hall">
      <div className="user-hall__info">
        <div className="user-hall__seans-name">{filmTitle}</div>
        <div className="user-hall__seans-start">{seanceTime}</div>
        <div className="user-hall__hall-name">{hallConfig.hall_name}</div>
      </div>
      <div className="user-scheme">
        <div className="user-scheme__screen">экран</div>
        <div className="user-scheme__wrapper">
          <div className="user-scheme__grid" style={{gridTemplateRows: `repeat(${hallConfig.hall_config.length}, 1fr)`}}>
            {hallConfig.hall_config.map((row, rowIdx) => (
              <div key={rowIdx} style={{display: 'flex'}}>
                {row.map((seat, seatIdx) => {
                  const seatKey = `${rowIdx}-${seatIdx}`;
                  let seatClass = 'user-scheme__seat ';
                  if (seat === 'vip') seatClass += 'user__vip-seat';
                  else if (seat === 'standart') seatClass += 'user__free-seat';
                  else if (seat === 'busy') seatClass += 'user__busy-seat';
                  else seatClass += 'disabled-seat';
                  if (selectedSeats.includes(seatKey)) seatClass += ' user__selected-seat';
                  return (
                    <div
                      key={seatIdx}
                      className={seatClass}
                      onClick={() => handleSeatClick(rowIdx, seatIdx)}
                      title={
                        seat === 'disabled' ? 'Место недоступно' :
                        seat === 'busy' ? 'Место занято' :
                        seat === 'vip' ? `VIP место - ${hallConfig.hall_price_vip} руб.` :
                        `Обычное место - ${hallConfig.hall_price_standart} руб.`
                      }
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <div className="user-scheme__info">
          <div className="user-scheme__info-seat">
            <span className="user__free-seat user-scheme__seat" /> — свободно ({hallConfig.hall_price_standart} руб.)
          </div>
          <div className="user-scheme__info-seat">
            <span className="user__vip-seat user-scheme__seat" /> — VIP ({hallConfig.hall_price_vip} руб.)
          </div>
          <div className="user-scheme__info-seat">
            <span className="user__busy-seat user-scheme__seat" /> — занято
          </div>
          <div className="user-scheme__info-seat">
            <span className="user__selected-seat user-scheme__seat" /> — выбрано
          </div>
        </div>
        {selectedSeats.length > 0 && (
          <div className="user-hall__summary">
            <div className="user-hall__selected-seats">
              Выбрано мест: {selectedSeats.length}
            </div>
            <div className="user-hall__total-price">
              Общая стоимость: {totalPrice} руб.
            </div>
          </div>
        )}
        <button 
          className="user-hall__reserve button" 
          onClick={handleReserve} 
          disabled={selectedSeats.length === 0}
        >
          Забронировать {selectedSeats.length > 0 ? `(${totalPrice} руб.)` : ''}
        </button>
      </div>
    </div>
  );
};

export default Hall; 