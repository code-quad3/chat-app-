const GoogleStrategy=require('passport-google-oauth20').Strategy;
// google auth with jwt
passport.use(new GoogleStrategy({clientID: process.env.GOOGLE_CLIENT_ID,clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:'/auth/google/callback'},
async (accessToken,refreshToken,profile,done)=>{
  try{
    let user = await Person.findOne({googleId:profile.id});
    if(!user){
      user= new Person({username: profile.displayName,googleId: profile.id});
      await user.save();
    }
    const token =jwt.sign({id:user._id},process.env.JWT_SECRET);
    return done(null,{user,token});
  }
  catch(err){
         return done(err,null);
  }
 

}));