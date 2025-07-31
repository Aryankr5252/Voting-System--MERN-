import Election from '../models/Election.js';

export const checkElectionStatus = async (req, res, next) => {
  try {
    const election = await Election.findOne();
    if (!election) {
      return res.status(400).json({ msg: 'Election not set' });
    }

    const now = new Date();
    const isTimeOver = now > new Date(election.endDate);
    const isEnded = election.isEnded;

    if (isTimeOver || isEnded) {
      return res.status(403).json({ msg: 'Voting has ended' });
    }

    next(); // ✅ continue to vote route
  } catch (err) {
    return res.status(500).json({ msg: 'Election status check failed' });
  }
};
