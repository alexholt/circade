import ReactDom from 'react-dom';
import React from 'react';
import Calendar from './js/calendar';
import moment from 'moment';
import Notepad from './js/notepad';

import './css/index.css';

window.addEventListener('load', () => {
  ReactDom.render(
    <div className='layout'>
      <Calendar date={moment().subtract(2, 'month')}/>
      <Notepad/>
    </div>,
    document.body.querySelector('main')
  );
});
