const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const express = require('express');
const emailValidator = require('email-validator');
const passwordValidator = require('./password-validator');

const env = require('dotenv').config();

if (env.error) {
  throw env.error;
}

const {
  getEntries,
  putEntry,
  postEntry,
  deleteEntry,
  login,
  createUser,
  getOutstandingTasks,
} = require('./db');

const app = express();

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PUT');
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.get('/entries/:year/:month/:day', async function (req, res) {
  const {year, month, day} = req.params;

  if (!req.session.uid || req.session.uid == 'undefined') {
    res.end(JSON.stringify({status: 'failure'}));
    return;
  }

  getEntries(req.session.uid, `${year}-${month}-${day}`).then(result => {
    if (!result) result = {type: 'task', entry: ''};
    res.send(JSON.stringify(result));
  });
});

app.get('/outstanding-tasks', async function (req, res) {
  if (!req.session.uid) {
    res.end(JSON.stringify({status: 'failure'}));
    return;
  }

  getOutstandingTasks(req.session.uid).then(result => {
    res.send(JSON.stringify(result));
  });
});

app.get('/logout', function (req, res) {
  res.redirect('/login');
  res.end();
});

app.get('/login', function (req, res) {
  res.end(JSON.stringify({status: req.session.uid ? 'success' : 'failure'}));
});

app.options('/login', function (req, res, next) {
  next();
});

app.post('/auto', function (req, res) {
  res.send(JSON.stringify(req.body));
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
  if (!emailValidator.validate(req.body.email)) {
    res.status(400);
    res.send({ status: 'invalid request', field: 'email', message: 'Email is not a valid one.'});
    return req.next();
  }

  if (!passwordValidator.validate(req.body.password)) {
    res.status(400);
    res.send({
      status: 'invalid request',
      field: 'password',
      message: 'Password must be at least 10 characters and contain both uppercase and lowercase letters.'
    });
    return req.next();
  }

  const result = await createUser(req.body.email, req.body.password);
  if (result.status === 'success') {
    req.session.uid = result.message;
  }

  res.send(JSON.stringify(result));
});

app.post('/entry/:year/:month/:day', async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const {year, month, day} = req.params;

  if (!req.session.uid) {
    res.send(JSON.stringify({status: 'failure'}));
    return;
  }

  postEntry(req.session.uid, req.body.id, `${year}-${month}-${day}`, req.body.type, req.body.entry).then(result => {
    res.send({result});
  });
});

app.put('/entry/:year/:month/:day', async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  const {year, month, day} = req.params;

  if (!req.session.uid) {
    res.send(JSON.stringify({status: 'failure'}));
    return;
  }

  putEntry(req.session.uid, `${year}-${month}-${day}`, req.body.type, req.body.entry).then(result => {
    res.send({id: result[0][0]['last_insert_id()']});
  });
});

app.delete('/entry/:year/:month/:day/:id', async function (req, res) {
  const {year, month, day, id} = req.params;

  deleteEntry(req.session.uid, id, `${year}-${month}-${day}`).then(result => {
    res.send({result});
  });
});

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));

// Export for testing
module.exports = app;