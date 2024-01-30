const express = require('express');
const app = express();
const cors = require('cors')
// require('dotenv/config');
const PORT = 3001 || 5000;
const logger = require('morgan');




//routes
const userRoutes = require('./routers/userRoutes');
const vendorRoutes = require('./routers/vendorRoutes');
const adminRoutes = require('./routers/adminRoutes.js');



//middlewares
app.use(logger('dev'))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: 'http://localhost:3000', // allow requests from this origin
    credentials: true, // allow credentials to be sent with the request
  }))

//databaseConnection
const db=require('./config/databaseConnection.js')
db();

//     
app.use('/',userRoutes)
app.use('/admin',adminRoutes)
app.use('/vendor',vendorRoutes)



//serverPort
app.listen(PORT, () => console.log(`server started on ${PORT}`));