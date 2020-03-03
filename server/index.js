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

app.use(function (req, res) {
  req.session.lastSeen = Math.floor(Date.now() / 60e3);
  req.next();
});

app.use(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', `${process.env.ORIGIN}`);
  res.setHeader('Access-Control-Allow-Headers', `Content-Type`);
  req.next();
});

app.get('/entry/:year/:month/:day', async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const {year, month, day} = req.params;
  console.log("userId: ", req.session.userId);

  if (!req.session.userId) {
    res.send(JSON.stringify({status: 'failure'}));
    return;
  }

  getEntry(req.session.userId, `${year}-${month}-${day}`).then(result => {
    if (!result) result = {title: '', entry: ''};
    result.status = 'success';
    res.send(JSON.stringify(result));
  });
});

app.options('/login', async function (req, res) {
  req.next();
});

app.post('/login', async function (req, res) {
  let id;

  try {
    id = await login(req.body.email, req.body.password);
  } catch (err) {
    const message = process.env.NODE_ENV == 'development' ? err.message : 'Login failure.';
    res.send(JSON.stringify({status: 'failure', message}));
    return res.end();
  }

  if (id == null) {
    res.send(JSON.stringify({status: 'failure', message: 'Login failure.'}));
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

app.post('/entry/:year/:month/:day', async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const {year, month, day} = req.params;
  console.log("userId: ", req.session.userId);

  if (!req.session.userId) {
    res.send(JSON.stringify({status: 'failure'}));
    return;
  }

  postEntry(req.session.userId, `${year}-${month}-${day}`, req.body.title, req.body.entry).then(result => {
    res.send(JSON.stringify({status: 'success'}));
  });
});

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));
