module.exports = {
  validate(password) {
    return password.length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password);
  }
};