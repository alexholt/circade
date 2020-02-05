const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const express = require('express');
const env = require('dotenv').config();

if (env.error) {
  throw result.error
}

const {getEntry, putEntry, postEntry, login, createUser} = require('./db');

const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['mysecret'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(bodyParser.json());

app.use(function (req, res) {
  req.session.lastSeen = Math.floor(Date.now() / 60e3);
  req.next();
});

app.get('/:year/:month/:day', async function (req, res) {
  res.setHeader('Content-Type', 'text/json');
  const {year, month, day} = req.params;
  getEntry(1, `${year}-${month}-${day}`).then(result => {
    res.send(JSON.stringify(result));
  });
});

app.post('/login', async function (req, res) {
  const id = await login(req.body.email, req.body.password);
  if (id == null) {
    res.send(JSON.stringify({status: 'failure'}));
  } else {
    req.session.userId = id;
    res.send(JSON.stringify({status: 'success'}));
  }
});

app.put('/user', async function (req, res) {
  const id = await createUser(req.body.email, req.body.password);
  if (id == null) {
    res.send(JSON.stringify({status: 'failure'}));
  } else {
    req.session.userId = id;
    res.send(JSON.stringify({status: 'success'}));
  }
});

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
