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

router.get("/", async (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/blockchain";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }
  const username = req.query.username;
  const result = await db.find_one("blockchain", "accounts", {
    username: username,
  });
  const data = await db.find_one('battle_pass', 'december', {username:username})
  if (result.battlepass === 1) {
    res.render(
      "C:/Users/Pungesti41/Desktop/blockchain_2-0-main/backend/other/battlepass_html/battlepass.ejs",
      {
        username: username,
        ethm_buyed: result.ethm_buyed,
        ethm_sell: result.ethm_sell,
        ng_played: result.ng_played,
        discord_connected: result.discord_connected,
        m1: data.mission_1,
        m2: data.mission_2,
        m3: data.mission_3,
        m4: data.mission_4,
        m5: data.mission_5
      }
    );
  } else {
    if (result.battlepass == 2) {
      res.send("You already complete December Battlepass!");
    } else {
      res.send("You need to buy a battlepass for enter in this section!");
    }
  }

});

module.exports = router;
