import express from 'express';
import Candidate from '../models/Candidate.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { verifyToken } from '../middleware/verifyToken.js';
import User from '../models/User.js';

const router = express.Router();

// ✅ Admin Adds a Candidate
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

// ✅ Get Voting Results (sorted by vote count)
router.get('/results', protect, adminOnly, async (req, res) => {
  try {
    const results = await Candidate.find().sort({ voteCount: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
});

// Reset all votes (admin only)
router.post('/reset', verifyToken, async (req, res) => {
  try {
    const user = await user.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await Candidate.updateMany({}, { voteCount: 0 });
    await User.updateMany({}, { hasVoted: false });

    res.json({ msg: 'Election has been reset' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to reset election' });
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


export default router;
