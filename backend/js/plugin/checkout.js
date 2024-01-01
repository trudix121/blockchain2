const express = require("express");
const app = express();
const body = require("body-parser");
const ejs = require("ejs");
const router = express.Router();
const db = require("../../db/db.js");
const { format } = require("date-fns");
const currentDate = new Date();
const formattedDate = format(currentDate, "dd-MM-yyyy HH:mm:ss");

const cors = require("cors");
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
  "../../frontend/admin",
  "  ../../frontend/blockchain",
  "  ../../frontend/index",
  "  ../../frontend/quests",
  "  ../../frontend/curency",
  "  ../../frontend/games",
  "../../frontend/chat",
  "../other/battlepass_html",
]);

app.use(router);


module.exports = router;