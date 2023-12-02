const express = require("express");
const app = express();
const body = require("body-parser");
const ejs = require("ejs");
const router = express.Router();
const db = require("../db/db.js");
const { format } = require("date-fns");
const { createCipheriv } = require("crypto");
const currentDate = new Date();
const formattedDate = format(currentDate, "dd-MM-yyyy HH:mm:ss");

router.use(body.json());
router.use(body.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", [
  "../../frontend/admin",
  "  ../../frontend/blockchain",
  "  ../../frontend/index",
  "  ../../frontend/quests",
  "  ../../frontend/curency",
  "  ../../frontend/games",
  "../../frontend/chats"
]);

app.use(router);


router.get('/', (req,res)=>{
    res.render('../../frontend/chats/chat.ejs')

})
router.get('/register',(req,res)=>{
    res.render('../../frontend/chats/register2')
})
router.post('/register', (req,res)=>{
    console.log(req.body)
})
module.exports = router