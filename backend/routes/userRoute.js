const express = require('express');
const router = express.Router();
const Person = require('../models/Person'); 
const Message = require('../models/Message');
const {jwtAuthMiddleware} = require('../jwt');
const mongoose= require('mongoose');


//Get list of contact data with latest messsages

router.get('/contact-data', jwtAuthMiddleware, async (req, res) => {
    try {
      // Fetch contacts for the authenticated user
      const user = await Person.findById(req.user.id).populate('contacts', '-password');
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Format contacts into a dictionary for easy message matching
      const contactList = user.contacts.map(contact => ({
        id: contact._id,
        name: contact.name,
        lastMessage: null, // Placeholder; we'll populate this with the latest message
        time: null
      }));
  
      // Fetch messages where the user is either the sender or receiver
      const messages = await Message.find({
        $or: [{ sender: req.user.id }, { receiver: req.user.id }]
      })
      .populate('sender', 'name')
      .populate('receiver', 'name')
      .sort({ createdAt: -1 }); // Sort by latest message first
  
      // Create a map for the latest messages by contact
      const lastMessageMap = {};
  
      // Iterate over messages to find the latest message for each contact
      messages.forEach(message => {
        const otherUserId = message.sender._id.equals(req.user.id) ? message.receiver._id : message.sender._id;
        if (!lastMessageMap[otherUserId]) {
          lastMessageMap[otherUserId] = {
            lastMessage: message.content,
            time: message.createdAt
          };
        }
      });
  
      // Combine contacts with their latest messages
      const combinedData = contactList.map(contact => ({
        ...contact,
        lastMessage: lastMessageMap[contact.id]?.lastMessage || 'No messages yet',
        time: lastMessageMap[contact.id]?.time || contact.time
      }));
  
      res.json(combinedData);
    } catch (error) {
      console.error('Error fetching combined data:', error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  });



// Add new friend
router.post('/add-friend', jwtAuthMiddleware, async (req, res) => {
    let { friendId } = req.body;
         const userId =req.user.id;
         friendId = new mongoose.Types.ObjectId(friendId);

          console.log(friendId);
    try {
        // Find the user by their ID
        const user = await Person.findById(userId);

        // Check if the friend is already in the contacts
        if (user.contacts.includes(friendId)) {
            return res.status(409).json({ message: 'Friend already exists in contacts' });
        }

        // Add the friend to the contacts array
        user.contacts.push(friendId);
        await user.save();

        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ message: 'Error adding friend' });
    }
});


// Remove friend
router.post('/remove-friend', async (req, res) => {
    const { friendId } = req.body;

    try {
        await Person.findByIdAndUpdate(req.user.id, { $pull: { contacts: friendId } });
        res.json({ message: 'Friend removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing friend' });
    }
});

// Change email
router.put('/change-email',jwtAuthMiddleware, async (req, res) => {
    const { newEmail } = req.body;

    try {
        await Person.findByIdAndUpdate(req.user.id, { email: newEmail }); 
        res.json({ message: 'Email changed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error changing email' });
    }
});

// Add status
router.put('/status',jwtAuthMiddleware, async (req, res) => {
    const { status } = req.body;

    try {
        await Person.findByIdAndUpdate(req.user.id, { status }); 
        res.json({ message: 'Status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
});

// Get user profile
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the userId from the JWT
        const user = await Person.findById(userId).select('name email status'); // Select only the required fields

        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // In case the user doesn't exist
        }

        res.json({

            name: user.name,
            email: user.email,
            status: user.status
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});


router.get('/contacts',jwtAuthMiddleware, async (req, res) => {
  try {
      const userId = req.user.id;

      // Find the user by ID and get the contacts array
      const user = await Person.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Fetch each contact's details based on the IDs in the contacts array
      const contacts = await Person.find(
          { _id: { $in: user.contacts } },
          '_id name status'
      );

      // Respond with the array of objects
      res.json(contacts);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});






module.exports = router;
