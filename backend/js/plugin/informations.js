const express = require("express");
const app = express();
const body = require("body-parser");
const ejs = require("ejs");
const router = express.Router();
const db = require("../../db/db.js");
const { format } = require("date-fns");
const { createCipheriv } = require("crypto");
const currentDate = new Date();
const formattedDate = format(currentDate, "dd-MM-yyyy HH:mm:ss");
const fs = require('fs')


const cors = require('cors')
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const corsMiddleware = cors(corsOptions);
app.use(corsMiddleware);

router.use(body.json());
router.use(body.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", [
  '../../frontend/admin',
'  ../../frontend/blockchain',
'  ../../frontend/index',
'  ../../frontend/quests',
'  ../../frontend/curency',
'  ../../frontend/games',
"../../frontend/chat"
]);

app.use(router);


router.get('/bp_missions', (req, res) => {
    // Calea către fișierul .txt


    res.sendFile('C:/Users/Pungesti41/Desktop/blockchain_2-0-main/backend/js/plugin/inf_content/battlepass_missions.html')
  });


router.get('/premium_account', (req,res)=>{


  
  res.sendFile('C:/Users/Pungesti41/Desktop/blockchain_2-0-main/backend/js/plugin/inf_content/premium_account.html')
})


module.exports = router