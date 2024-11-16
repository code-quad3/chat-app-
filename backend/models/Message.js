

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    room: { 
        type: Schema.Types.ObjectId, 
        ref: 'Room', 
        required: false ,
        sparse: true,
    },
    sender: { 
        type: Schema.Types.ObjectId, 
        ref: 'Person',  
        required: true 
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,     
    },
    content: { 
        type: String, 
        required: true 
    },
    type: {
        type: String,
        enum: ['group','private'],
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
},{timestamps: true});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;