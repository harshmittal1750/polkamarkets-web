const { api } = require('./index');

async function getMarket(marketSlug) {
  const url = `http://localhost:4000/markets/${marketSlug}`;
  return api.get(url);
}

module.exports = {
  getMarket
};
