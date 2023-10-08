const { api } = require('./index');

async function getTournamentBySlug(tournamentSlug) {
  const url = `http://localhost:4000/tournaments/${tournamentSlug}`;
  return api.get(url);
}

module.exports = {
  getTournamentBySlug
};
