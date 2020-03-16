const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const express = require('express');
const env = require('dotenv').config();

if (env.error) {
  throw env.error;
}

const {getEntry, postEntry, login, createUser} = require('./db');

const app = express();

app.use(cookieSession({
  name: 'session',
  keys: ['mysecret'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(bodyParser.json());

app.use(function (req, res, next) {
  req.session.lastSeen = Math.floor(Date.now() / 60e3);
  next();
});

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', `${process.env.ORIGIN}`);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.get('/entry/:year/:month/:day', async function (req, res) {
  const {year, month, day} = req.params;

  if (!req.session.uid) {
    res.end(JSON.stringify({status: 'failure'}));
  }

  getEntry(req.session.uid, `${year}-${month}-${day}`).then(result => {
    if (!result) result = {title: '', entry: ''};
    result.status = 'success';
    res.send(JSON.stringify(result));
  });
});

app.get('/logout', function (req, res) {
  res.end();
});

app.get('/login', function (req, res) {
  res.end(JSON.stringify({status: req.session.uid ? 'success' : 'failure'}));
});

app.options('/login', function (req, res, next) {
  next();
});

app.post('/login', async function (req, res) {
  let id;

  try {
    id = await login(req.body.email, req.body.password);
    req.session.uid = id;

    if (id == null) {
      res.send(JSON.stringify({status: 'failure', message: 'Login failure.'}));
    } else {
      res.end(JSON.stringify({status: 'success'}));
    }

  } catch (err) {
    const message = process.env.NODE_ENV == 'development' ? err.message : 'Login failure.';
    res.end(JSON.stringify({status: 'failure', message}));
  }
});

app.put('/user', async function (req, res) {
  const id = await createUser(req.body.email, req.body.password);
  if (id == null) {
    res.send(JSON.stringify({status: 'failure'}));
  } else {
    req.session.uid = id;
    res.send(JSON.stringify({status: 'success'}));
  }
});

app.post('/entry/:year/:month/:day', async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const {year, month, day} = req.params;

  if (!req.session.uid) {
    res.send(JSON.stringify({status: 'failure'}));
    return;
  }

  postEntry(req.session.uid, `${year}-${month}-${day}`, req.body.title, req.body.entry).then(result => {
    res.send(JSON.stringify({status: 'success'}));
  });
});

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
