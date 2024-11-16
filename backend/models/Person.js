const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      //required: true,
      unique: true,
      trim: true,
      lowercase: true,
      sparse: true
    },
    password: {
      type: String,
//required: true,
    },
    googleId:{
       type: String,
       unique: true,
       sparse: true,
    },
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isBot :{
         type:Boolean,
         default: false,
    },
    profilePicture: {
      type: String,
      default: '', // URL to profile picture
    },
    status: {
      type: String,
      default: 'Hey there! I am using the chat app.', // User status or bio
    },
    
    contacts: [{type: mongoose.Schema.Types.ObjectId,ref:'Person'}]
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create User model
const User = mongoose.model('Person', userSchema);

module.exports = User;
