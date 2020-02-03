const express = require('express');
const app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/:year/:month/:day', function (req, res) {
  res.setHeader('Content-Type', 'text/json');
  const {year, month, day} = req.params;
  res.send(JSON.stringify({title: `SELECTED: ${year}-${month}-${day}`, entry: 'Entry: ' + Math.random()}));
});

app.listen(9009, () => console.log('Listening'));
