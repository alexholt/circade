import ReactDom from 'react-dom';
import React from 'react';
import App from './js/app';

import './css/index.css';

window.addEventListener('load', () => {
  ReactDom.render(
    <App/>,
    document.body.querySelector('main')
  );
});
