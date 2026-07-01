const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const chatController = require('../controllers/chatController');

router.get('/rooms', auth(), chatController.getChatRooms);
router.get('/:roomId/messages', auth(), chatController.getMessages);

module.exports = router;
