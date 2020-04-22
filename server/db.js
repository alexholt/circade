const crypto = require('crypto');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  database: 'circade',
  user: 'circade',
  password: 'circade',
  connectionLimit: 5
});

async function execute(statement, values = [], isSingle = true) {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    rows = await conn.query(statement, values);
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }

  if (isSingle) return rows[0];
  return rows;
}

async function getEntries(userId, date) {
  return await execute('select entry, type, id from entries where user_id=? and date=?', [userId, date], false);
}

async function getOutstandingTasks(userId) {
  return await execute(
    'select entry, date, id from entries where user_id=? and type=? order by date asc',
    [userId, 'task'],
    false
  );
}

async function postEntry(userId, id, date, type, entry) {
  return await execute(
    'update entries set type=?, entry=? where user_id=? and date=? and id=?',
    [type, entry, userId, date, id]
  );
}

async function putEntry(userId, date, type, entry) {
  const conn = await pool.getConnection();

  conn.query(
    'insert into entries set user_id=?, date=?, type=?, entry=?',
    [userId, date, type, entry]
  );

  return conn.batch('select last_insert_id()', []);
}

async function deleteEntry(userId, id, date) {
  return await execute(
    'delete from entries where user_id=? and date=? and id=?',
    [userId, date, id]
  );
}

async function sha512(password) {
  const result = await execute('select SHA2(?, 512)', [password + process.env.AUTH_SALT]);
  return Object.values(result)[0];
}

async function getUser(email) {
  const result = await execute('select id, password from users where email=?', [email]);
  return result;
}

async function createUser(email, password) {
  const hashed = await sha512(password);
  const result = await execute('insert into users (email, password) values (?, ?)', [email, hashed]);
  return await getUser(email).id;
}

async function login(email, password) {
  const hashed = await sha512(password);
  const user = await getUser(email);
  if (!user) return null;
  console.log(hashed, user.password);
  if (hashed == user.password) return user.id;
  return null;
}

module.exports = {
  getEntries,
  putEntry,
  postEntry,
  deleteEntry,
  createUser,
  login,
  getOutstandingTasks,
};
