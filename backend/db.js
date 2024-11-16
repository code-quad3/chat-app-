require('dotenv').config();
const mongoose= require('mongoose');
//Define the mongodb connection URL
const mongoURL=process.env.MONGO_URL;
//Set up MongoDb connection
mongoose.connect(mongoURL,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);


const db= mongoose.connection;


//Define event listeners for database connection
db.on('connected',()=>{
    console.log("connected to MongoDb server");
});

db.on('disconnected',()=>{
    console.log("MongoDb disconnected");
});
db.on('error',(err)=>{
    console.log("MongoDb connection error",err);
});
//Export the database connection

module.exports=db;