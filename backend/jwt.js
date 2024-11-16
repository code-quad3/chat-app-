require('dotenv').config();
const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {

    // first check request headers has authorization or not
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({ error: 'Token Not Found' });

    // Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    
    
    if(token==='null') return res.status(401).json({ error: 'Unauthorized' });
     
    try{
       
    const decoded = jwt.decode(token,{complete: true});
    const currentTime = Math.floor(Date.now()/1000);
    
    if(decoded.payload.exp < currentTime){
    return  res.status(401).json({error:'Token has expired'});
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({message:'Unauthorization access'});
        }
        req.user = decoded;
        next();
    })

    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Invalid token' });
    }
}


// Function to generate JWT token
const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET,{expiresIn:"8h"});
}

module.exports = {jwtAuthMiddleware, generateToken};