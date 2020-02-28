const importer = require('postcss-easy-import');
const nested = require('postcss-nested');

module.exports = {
  plugins: [
    importer(),
    nested(),
  ],
  watch: true
};
