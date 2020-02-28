import React from 'react';
import moment from 'moment';

function labels() {
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) =>
    <strong key={i} className="calendar--day">{day}</strong>
  );
}

function days(start, end) {
  const startMonth = start.get('month');
  const arr = [];

  end.add(1, 'day');

  do {
    arr.push([start.date(), start.month()]);
    start.add(1, 'day');
  } while(!start.isSame(end, 'date'));

  return arr.map(d => {
    const [day, month] = d;
    return (
      <span key={`${month}-${day}`} className="calendar--day">
        {day}
      </span>
    );
  });
}

  export default function({date}) {
    let start = moment(date).startOf('month').startOf('week');
    let end = moment(date).endOf('month').endOf('week');

    return (
      <div className='layout--calendar calendar'>
        <h1>{moment(date).format('MMMM')}</h1>
        <div className='calendar--dates'>
          {labels()}
          {days(start, end)}
        </div>

        <div className="calendar--tray">
          <a href="/outstanding-tasks">Outstanding Tasks</a>
          <a href="/logout">Logout</a>
        </div>
      </div>
    );
  }
