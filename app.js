const express = require("express"); //require express
const app = express(); //create an express server called app 


//const db = require("./db/connection"); NOT SURE THIS IS NEEDED IN HERE 

const { getTreasures, getTreasuresByID } = require("./controllers/treasures-controller.js");

//app.use(express.json()); //THIS ADDS MIDDLEWARE THAT PARSES JSON DATA FROM POST/PATCH/PUT REQUESTS (DATA SENT FROM THE CLIENT)

app.get("/api/treasures", getTreasures);

app.get("/api/treasures/:treasure_id", getTreasuresByID);


module.exports = app; //EXPORT THE APP GLOBALLY SO WE HAVE ACCESS TO IT IN THE TEST SUITE
