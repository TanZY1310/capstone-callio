//js: language, nodejs: runtime environment for program/web app
//express.js: a framework
//nodejs makes js runnable outside a browser, opens up npm modules
require('dotenv').config();

//note: require('') is the nodejs ver of writing import
const express = require('express');
const cors = require("cors");
const whatsappRoutes = require('./routes/whatsapp');

//declare express.js object
const app = express();

// configure CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only your React app's origin
  //methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP behaviors
  credentials: true                // Allow cookies/auth headers if needed
};

app.use(express.json()); 
app.use(cors(corsOptions)); // 3. Apply the middleware
// or whatever base path, need adjustment
app.use('/', whatsappRoutes); 

const PORT = process.env.PORT || 3001;

//comes last in the main app, 
//initialize & start web server for incoming client requests
app.listen(PORT, () => {
    console.log(`Server is running and listening on port ${PORT}`);
});