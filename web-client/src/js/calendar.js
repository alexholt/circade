import React from 'react';
import moment from 'moment';

function labels() {
  return ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) =>
    <strong key={i} className="calendar--day">{day}</strong>
  );
}

function days(start, end, selected, onSelected) {
  const startMonth = start.get('month');
  const arr = [];

  end.add(1, 'day');

  do {
    arr.push(start.clone());
    start.add(1, 'day');
  } while (!start.isSame(end, 'date'));

  return arr.map(d => {
    const color = selected.isSame(d, 'date') ? 'white' : 'black';

    return (
      <span onClick={onSelected.bind(null, d.clone())} key={`${d.month()}-${d.date()}`} className="calendar--date" style={{color}}>
        {d.date()}
      </span>
    );
  });
}

export default function({selectedDate, onDateSelected}) {
  let start = selectedDate.clone().startOf('month').startOf('week');
  let end = selectedDate.clone().endOf('month').endOf('week');

  return (
    <div className='layout--calendar calendar'>
      <h1>{moment(selectedDate).format('MMMM')}</h1>
      <div className='calendar--dates'>
        {labels()}
        {days(start, end, selectedDate, onDateSelected)}
      </div>

      <div className="calendar--tray">
        <a href="/outstanding-tasks">Outstanding Tasks</a>
        <a href="/logout">Logout</a>
      </div>
    </div>
  );
}
