
const scores = {}; // { [matchId]: { runs, wickets, overs, updatedAt } }

exports.updateScore = (matchId, data) => {
  scores[matchId] = { ...data, updatedAt: new Date() };
};

exports.getScore = (req, res) => {
  const { matchId } = req.params;
  const score = scores[matchId] || { runs:0, wickets:0, overs:0, updatedAt: new Date() };
  return res.json({ matchId, ...score });
};
