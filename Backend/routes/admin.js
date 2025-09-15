import express from 'express';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import Election from '../models/Election.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// ✅ Add Candidate
router.post('/add-candidate', protect, adminOnly, async (req, res) => {
  const { name, party } = req.body;
  try {
    const candidate = new Candidate({ name, party });
    await candidate.save();
    res.status(201).json({ msg: 'Candidate added', candidate });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
});

// Delete all candidates (admin only)
router.delete('/delete-candidates', verifyToken, async (req, res) => {
  try {
    await Candidate.deleteMany(); // delete all candidates
    const updated = await User.updateMany({}, { hasVoted: false });
    // console.log('Update Result:', updated);
    res.json({ msg: 'All candidates and voting statuses reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to reset election data' });
  }
});

// ✅ Get Results
router.get('/results', protect, adminOnly, async (req, res) => {
  try {
    const results = await Candidate.find().sort({ voteCount: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
});

// ✅ Election Status Check
router.get('/election-status', async (req, res) => {
  try {
    const election = await Election.findOne();
    if (!election) return res.json({ ended: false });

    const now = new Date();
    const isTimeOver = now > new Date(election.endDate);
    const ended = election.isEnded || isTimeOver;

    res.json({ ended });
  } catch (err) {
    res.status(500).json({ ended: false });
  }
});

// ✅ Winner (Handles Draws Also)
router.get('/winner', async (req, res) => {
  try {
    const election = await Election.findOne();
    if (!election) return res.status(400).json({ msg: 'Election not found' });

    const now = new Date();
    const ended = election.isEnded || now > new Date(election.endDate);
    if (!ended) return res.status(403).json({ msg: 'Voting still ongoing' });

    // Fetch all candidates
    const candidates = await Candidate.find().sort({ voteCount: -1 });

    if (!candidates.length) return res.status(404).json({ msg: 'No candidates found' });

    // Find the max vote count
    const maxVotes = candidates[0].voteCount;

    // Filter all candidates with maxVotes
    const winners = candidates.filter(c => c.voteCount === maxVotes);

    if (winners.length === 1) {
      // ✅ Single Winner
      return res.json({ status: "winner", winner: winners[0] });
    } else {
      // ✅ Draw
      return res.json({ status: "draw", winners });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error fetching winner' });
  }
});


// ✅ Set Election with end time
router.post('/election', verifyToken, async (req, res) => {
  const { endDate } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ msg: 'Access denied' });

    const existing = await Election.findOne();
    if (existing) {
      const now = new Date();
      const end = new Date(existing.endDate);
      if (!existing.isEnded && end > now) {
        return res.status(400).json({ msg: 'Election already set' });
      }
    }

    await Election.deleteMany(); // Remove old elections
    const election = new Election({ endDate, isEnded: false });
    await election.save();
    res.json({ msg: 'Election set successfully', election });
  } catch (err) {
    res.status(500).json({ msg: 'Error setting election' });
  }
});

// ✅ Manual End Election
router.post('/end', protect, adminOnly, async (req, res) => {
  try {
    const election = await Election.findOne();
    if (!election) return res.status(404).json({ msg: 'No election found' });

    election.isEnded = true;
    await election.save();
    res.json({ msg: 'Election manually ended' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to end election' });
  }
});

// ✅ Reset Election
router.post('/reset', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) return res.status(403).json({ msg: 'Access denied' });

    await Candidate.updateMany({}, { voteCount: 0 });
    await User.updateMany({}, { hasVoted: false });
    await Election.deleteMany();

    res.json({ msg: 'Election reset successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to reset election' });
  }
});

export default router;
