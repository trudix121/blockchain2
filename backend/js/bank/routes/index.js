const express = require('express')
const app = express();
const body = require("body-parser");
const ejs = require("ejs");
const router = express.Router();
const db = require("../../../db/db");
const { format } = require("date-fns");
const { createCipheriv } = require("crypto");
const currentDate = new Date();
const formattedDate = format(currentDate, "dd-MM-yyyy HH:mm:ss");


const cors = require('cors');
const { userInfo } = require("os");
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

const corsMiddleware = cors(corsOptions);
app.use(corsMiddleware);

router.use(body.json());
router.use(body.urlencoded({ extended: true }));


app.use(router);


router.get('/', (req,res)=>{
    res.render('login')
})


module.exports = router