import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import './UserIndex.css';

// Импортируем QRCreator для генерации QR-кода
const QRCreator = window.QRCreator;

const Payment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState(null);

  const seanceId = localStorage.getItem('seanceId');
  const seanceHallId = localStorage.getItem('seanceHallId');
  const seanceTime = localStorage.getItem('seanceTime');
  const filmTitle = localStorage.getItem('filmTitle');
  const chosenDate = localStorage.getItem('chosenDate');
  const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats') || '[]');
  const totalPrice = localStorage.getItem('totalPrice') || '0';

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new FormData();
      params.append('seanceId', seanceId);
      params.append('seanceHallId', seanceHallId);
      params.append('seanceTime', seanceTime);
      params.append('filmTitle', filmTitle);
      params.append('chosenDate', chosenDate);
      params.append('seats', JSON.stringify(selectedSeats));
      params.append('totalPrice', totalPrice);
      const result = await apiService.setTicket(params);
      setTicket(result.result);
    } catch (e) {
      setError('Ошибка оплаты');
    } finally {
      setLoading(false);
    }
  };

  // Генерация QR-кода с полной информацией о билете
  useEffect(() => {
    if (ticket && QRCreator) {
      const ticketInfo = {
        date: chosenDate,
        time: seanceTime,
        film: filmTitle,
        hall: ticket.hall_name || 'Зал',
        row: selectedSeats.map(seat => {
          const [row, seatNum] = seat.split('-');
          return `Ряд ${parseInt(row) + 1}, Место ${parseInt(seatNum) + 1}`;
        }).join(', '),
        price: totalPrice,
        note: 'Билет действителен строго на свой сеанс',
        code: ticket.code || Math.random().toString(36).substr(2, 9)
      };

      const qrText = `БИЛЕТ В КИНОТЕАТР

Дата: ${ticketInfo.date}
Время: ${ticketInfo.time}
Фильм: ${ticketInfo.film}
Зал: ${ticketInfo.hall}
Места: ${ticketInfo.row}
Стоимость: ${ticketInfo.price} руб.
Код бронирования: ${ticketInfo.code}

${ticketInfo.note}`;

      const qr = QRCreator.create({
        text: qrText,
        radius: 0.5,
        ecLevel: 'M',
        fill: '#000000',
        background: '#ffffff',
        size: 200
      });

      setQrCode(qr);
    }
  }, [ticket, chosenDate, seanceTime, filmTitle, selectedSeats, totalPrice]);

  if (ticket && qrCode) {
    return (
      <div className="payment">
        <div className="payment-header">
          <div className="payment__title">Ваш билет</div>
        </div>
        <div className="ticket-info">
          <div className="ticket-info__hint">Фильм: {filmTitle}</div>
          <div className="ticket-info__hint">Дата: {chosenDate}</div>
          <div className="ticket-info__hint">Время: {seanceTime}</div>
          <div className="ticket-info__hint">Зал: {ticket.hall_name || 'Зал'}</div>
          <div className="ticket-info__hint">Места: {selectedSeats.map(seat => {
            const [row, seatNum] = seat.split('-');
            return `Ряд ${parseInt(row) + 1}, Место ${parseInt(seatNum) + 1}`;
          }).join(', ')}</div>
          <div className="ticket-info__hint">Стоимость: {totalPrice} руб.</div>
          <div className="ticket-info__hint">Код бронирования: {ticket.code || Math.random().toString(36).substr(2, 9)}</div>
          <div className="ticket-info__hint" style={{fontWeight: 'bold', color: '#ff4444'}}>
            Билет действителен строго на свой сеанс
          </div>
          <div className="ticket-info__qr">
            <div ref={(el) => {
              if (el && qrCode) {
                el.innerHTML = '';
                el.appendChild(qrCode);
              }
            }} />
          </div>
        </div>
        <button className="ticket-info__button button" onClick={() => navigate('/')}>На главную</button>
      </div>
    );
  }

  return (
    <div className="payment">
      <div className="payment-header">
        <div className="payment__title">Оплата билета</div>
      </div>
      <div className="ticket-info">
        <div className="ticket-info__hint">Фильм: {filmTitle}</div>
        <div className="ticket-info__hint">Дата: {chosenDate}</div>
        <div className="ticket-info__hint">Время: {seanceTime}</div>
        <div className="ticket-info__hint">Места: {selectedSeats.map(seat => {
          const [row, seatNum] = seat.split('-');
          return `Ряд ${parseInt(row) + 1}, Место ${parseInt(seatNum) + 1}`;
        }).join(', ')}</div>
        <div className="ticket-info__hint">Стоимость: {totalPrice} руб.</div>
      </div>
      {error && <div className="ticket-info__hint" style={{color: '#ff4444'}}>{error}</div>}
      <button className="ticket-info__button button" onClick={handlePay} disabled={loading}>
        {loading ? 'Оплата...' : `Оплатить ${totalPrice} руб.`}
      </button>
    </div>
  );
};

export default Payment; 