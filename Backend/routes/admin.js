import express from 'express';
import Candidate from '../models/Candidate.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { verifyToken } from '../middleware/verifyToken.js';
import User from '../models/User.js';
import Election from '../models/Election.js'; 

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


router.get('/status', async (req, res) => {
  const election = await Election.findOne();
  if (!election) return res.json({ isActive: false });

  const now = new Date();
  if (now > election.endDate && election.isActive) {
    election.isActive = false;
    await election.save();
  }

  res.json({ isActive: election.isActive });
});

router.post('/end', protect, adminOnly, async (req, res) => {
  const election = await Election.findOne();
  if (!election) return res.status(404).json({ msg: 'Election not found' });

  election.isActive = false;
  await election.save();
  res.json({ msg: 'Voting ended manually' });
});

// for Winner Candidate

router.get('/winner', async (req, res) => {
  const winner = await Candidate.findOne().sort({ voteCount: -1 });
  res.json(winner);
});

// POST /admin/election
router.post('/election', verifyToken, async (req, res) => {
  const { endDate } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const existing = await Election.findOne();

    if (existing && !existing.isEnded && new Date(existing.endDate) > new Date()) {
      return res.status(400).json({ msg: 'Election already set' });
    }

    // If election ended or not found, create/update
    await Election.deleteMany();
    const election = new Election({ endDate, isEnded: false });
    await election.save();

    res.json({ msg: 'Election set successfully', election });
  } catch (err) {
    res.status(500).json({ msg: 'Error setting election' });
  }
});


// POST /admin/end
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

router.get('/status', async (req, res) => {
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

// Election reset route — also delete or update the election status
router.post('/reset', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await Candidate.updateMany({}, { voteCount: 0 });
    await User.updateMany({}, { hasVoted: false });

    // 🧠 Fix: Remove or reset the election
    await Election.deleteMany(); // OR: updateMany({}, { isEnded: false, endDate: null })

    res.json({ msg: 'Election has been reset' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to reset election' });
  }
});



export default router;
