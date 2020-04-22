import React from 'react';
import moment from 'moment';

import {Link} from 'react-router-dom';


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

function Tasks({tasks}) {
  let lastDate = moment('2000-01-01');

  const mapped = tasks.map(task => {
    let dateHeading = null;
    const currentDate = moment(task.date);

    if (!lastDate.isSame(currentDate, 'date')) {
      lastDate = currentDate;

      dateHeading = (
        <h3 className='calendar--tray--heading'>
          {`${currentDate.format('MMMM')} ${currentDate.date()}`}
        </h3>
      );
    }

    return (
			<div>
      	{dateHeading}

      	<Link
					key={`link-${task.id}`}
					to={`/journal/${lastDate.year()}/${lastDate.format('MM')}/${lastDate.date()}`}
				>
          &sdot;{task.entry}
      	</Link>

			</div>
    );
  });

  return <>{mapped}</>;
}

export default function({selectedDate, onDateSelected, tasks}) {
  let start = selectedDate.clone().startOf('month').startOf('week');
  let end = selectedDate.clone().endOf('month').endOf('week');

  return (
    <div className='layout--calendar layout--rhythm calendar'>
      <h1>{moment(selectedDate).format('MMMM')}</h1>
      <div className='calendar--dates'>
        {labels()}
        {days(start, end, selectedDate, onDateSelected)}
      </div>

      <div className="calendar--tray">
				<h2>Outstanding Tasks</h2>
        <Tasks tasks={tasks}/>
        <a href="/logout">Logout</a>
      </div>
    </div>
  );
}
