require("dotenv").config();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Person = require("./models/Person");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy= require("passport-facebook");
// Traditional username/password authentication

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      console.log("Received credentials:", username, password);

      const user = await Person.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const isPasswordMatch = await user.comparePassword(password); 
      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Incorrect password." });
      }
    } catch (err) {
      return done(err);
    }
  })
);        

// Google OAuth 
passport.use(new GoogleStrategy({clientID:process.env.GOOGLE_CLIENT_ID,
  clientSecret:process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:"http://localhost:4000/auth/google/callback"
},
async function (accessToken,refreshToken,profile,done){
  try {
    // Find a user by Google ID
    
    let user = await Person.findOne({ googleId: profile.id });
    if (!user) {
      // If the user doesn't exist, create a new user
    
      user = new Person({
       name: profile.displayName, // or another field you'd like to use
        googleId: profile.id,
        
        // Add other profile fields as needed
        
      });
      console.log(user);
     await user.save();
    }
    return done(null, user); // Pass the user to the next middleware
  } catch (err) {
    return done(err);
  }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FB_CLIENT_ID,
  clientSecret: process.env.FB_CLIENT_SECRET,
  callbackURL:'http://localhost:4000/auth/facebook/callback',
  profileFields: ['id','displayName','email']
},
 async function(accessToken,refreshToken,profile,done){
  try{
    let user = await Person.findOne({facebookId: profile.id});
    if(!user){
      user= new Person({name: profile.displayName,
      facebookId: profile.id,
    
    });
    await user.save();

  }
  return done(null,user);
}   catch (err){
  return done(err);
}
}));

module.exports = passport;
