const express = require("express");
const app = express();
const body = require("body-parser");
const ejs = require("ejs");
const router = express.Router();
const db = require("../db/db.js");
const fns = require("date-fns");

router.use(body.json());
router.use(body.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", [
  '../../frontend/admin',
'  ../../frontend/blockchain',
'  ../../frontend/index',
'  ../../frontend/quests',
'  ../../frontend/curency',
'  ../../frontend/games'
]);

app.use(router);


router.get('/blkjk.jpg',(req ,res)=>[
    res.sendFile('C:/Users/Pungesti41/Desktop/blockchain_2-0/backend/cdn/blkjk.jpg')
])




module.exports = router;
