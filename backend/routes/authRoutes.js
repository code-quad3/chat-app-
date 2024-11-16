const express = require("express");
const router = express.Router();
const Person = require("../models/Person");
//const passport=require('passport');
const { jwtAuthMiddleware, generateToken } = require("../jwt");
const passport= require('../auth');
const nodemailer = require('nodemailer');
require("dotenv").config();
const jwt = require('jsonwebtoken');

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newPerson = new Person(data);
    const response = await newPerson.save();
    console.log("data saved");
    const payload = {
      id: response.id,
      username: response.username,
    };
    const token = generateToken(payload);
    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async(req,res)=>{
  try{
    const {email,password} =req.body;
    const user= await Person.findOne({email: email});
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid email or password '});
    }
    const payload={
      id: user.id,
      name: user.name
    }
    const token =generateToken(payload);
    res.json({token});
  }
  catch(err){
    res.status(500).json({error: 'Invalid Server error'});
  }
});


//Route to initialite Google OAuth login
router.get('/google',passport.authenticate('google',{scope: ['profile','email'],session: false}));


//Route for Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // req.user will contain the user profile (from passport after Google OAuth success)
  const user = req.user;

  // Generate JWT token after Google login
  const payload = {
    id: user.id,
    name: user.name,  // you can adjust this based on your model
  };
  const token = generateToken(payload);
  // Redirect or respond with the token
  res.redirect(`http://localhost:5173/social-redirect?token=${token}`);  });
router.get('/protected', (req, res) => {
  res.json({ message: "Authenticated by Google, JWT verified!" });
});

//Route for initialize OAuth login
router.get('/facebook',passport.authenticate('facebook',{session: false}));


//Route for FB OAuth callback 
router.get('/facebook/callback',passport.authenticate('facebook',{session: false}),(req,res)=>{
  const user= req.user;
  const payload ={
    id: user.id,
    name: user.name
,  };
const token =generateToken(payload);

res.redirect(`http://localhost:5173/social-redirect?token=${token}`);
});

router.get('/bye',(req,res)=>{
  res.json({message: "Authenciated by Facebook ,"});
})

// Forgot and Reset Password
const transporter= nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user:`${ process.env.EMAIL_USER}`,
    pass: process.env.EMAIL_PASS
  },
});


router.post('/forgot-password',async (req ,res)=>{
  
  const {Email} =req.body;
  
  const user = await Person.findOne({ email: Email });
  
  if(!user){
    
    return res.status(400).send('user not found');

  }
const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '15m'});

await transporter.sendMail({
  from:`${process.env.EMAIL_USER}`,
  to: Email,
  subject: 'Password Reset',
  text: `Your token is : ${token},`
});
res.status(200).send('Password reset link sent');
});


router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

// Verify token  
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    return res.status(400).send('Invalid token');
  }
  //Update password
   
  const user = await Person.findById(userId);
  if (!user) {
    return res.status(400).send('User not found');
  }

  user.password = newPassword; 
  await user.save();

  
  res.status(200).send('Password has been reset');
});







module.exports=router;
