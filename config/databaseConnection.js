const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config({path : '.env'});
mongoose.set('strictQuery',false)

const db = async () => {
    try{
        const con = await mongoose.connect(process.env.mongodb, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
        })
        console.log(`MongoDB connected : ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = db