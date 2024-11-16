const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Assuming you have a Message model
const {jwtAuthMiddleware} =require('../jwt');
// Get chat history for a specific user
router.get('/history/:userId',jwtAuthMiddleware, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId },
                { sender: req.params.userId, receiver: req.user.id }
            ]
        })
        .populate('sender', 'name') // Populate sender details
        .sort({ createdAt: 1 }); // Sort by oldest first
        
        const formattedMessages = messages.map((msg) => ({
            id: msg._id,
            sender: msg.sender._id.toString(), // or msg.sender if it's already a string
            text: msg.content,
            timestamp: msg.createdAt
          }));
          
          res.json(formattedMessages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user chat history' });
    }
});

// Remove chat history for a specific user
router.delete('/history/user/:userId',async (req, res) => {
    try {
        await Message.deleteMany({
            $or: [
                { sender: req.user.id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user.id }
            ]
        });

        res.json({ message: 'Chat history removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting chat history' });
    }
});

//Recent messages
router.get('/recent/:userId', async (req, res) => {
    try {
        const recentMessages = await Message.find({
            $or: [
                { sender: req.user.id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user.id }
            ]
        }).sort({ createdAt: -1 }).limit(1); // Get the 1 most recent messages
        res.json(recentMessages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent messages' });
    }
});




module.exports = router;
