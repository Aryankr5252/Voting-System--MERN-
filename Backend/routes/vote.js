import express from 'express';
import Candidate from '../models/Candidate.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get All Candidates
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ name: 1 });
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Vote Route
router.post('/cast', protect, async (req, res) => {
  const { candidateId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user.hasVoted) {
      return res.status(400).json({ msg: 'You have already voted' });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) return res.status(404).json({ msg: 'Candidate not found' });

    candidate.voteCount += 1;
    await candidate.save();

    user.hasVoted = true;
    user.votedFor = candidateId;
    await user.save();

    res.json({ msg: `Vote casted successfully for ${candidate.name}` });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
});

router.get('/results', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch results' });
  }
});


export default router;
