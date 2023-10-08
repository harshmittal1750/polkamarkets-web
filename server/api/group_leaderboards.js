const { api } = require('./index');

async function getLeaderboardGroupBySlug(groupSlug) {
  const url = `http://localhost:4000/group_leaderboards/${groupSlug}`;
  return api.get(url);
}

module.exports = {
  getLeaderboardGroupBySlug
};
