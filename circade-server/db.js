const crypto = require('crypto');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  database: 'circade',
  user: 'circade',
  password: 'circade',
  connectionLimit: 5
});

async function execute(statement, values = []) {
  let conn, rows;
  try {
    conn = await pool.getConnection();
    rows = await conn.query(statement, values);
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }

  return rows[0];
}

async function getEntry(userId, date) {
  return await execute('select title, entry from entry where user_id=? and date=?', [userId, date]);
}

async function putEntry(userId, date, title, entry) {
  return await execute(
    'insert into entry (user_id, date, title, entry) values (?, ?, ?, ?)',
    [userId, date, title, entry]
  );
}

async function postEntry(userId, date, title, entry) {
  return await execute(
    'update entry set title=?, entry=? where user_id=? and date=?',
    [title, entry, userId, date]
  );
}

function sha512(password) {
  const hash = crypto.createHmac('sha512', process.env.AUTH_SALT);
  hash.update(password);
  return hash.digest('hex');
}

async function getUser(email) {
  const result = await execute('select id, password from user where email=?', [email]);
  return result;
}

async function createUser(email, password) {
  const hashed = sha512(password);
  const result = await execute('insert into user (email, password) values (?, ?)', [email, hashed]);
  return await getUser(email).id;
}

async function login(email, password) {
  const hashed = sha512(password);
  const user = await getUser(email);
  if (!user) return null;
  if (hashed == user.password) return user.id;
  return null;
}

module.exports = {getEntry, putEntry, postEntry, createUser, login};
