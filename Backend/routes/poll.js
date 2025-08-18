import { protect } from '../middleware/authMiddleware.js';

router.post('/vote', protect, vote); // Only logged-in users can vote