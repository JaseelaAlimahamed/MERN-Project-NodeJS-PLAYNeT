const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config({path : '.env'});
mongoose.set('strictQuery',false)

const db = async () => {
    try{
        const con = await mongoose.connect('mongodb://127.0.0.1:27017/playnet', {
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