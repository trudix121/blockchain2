const express = require("express");
const app = express();
const body = require("body-parser");
const ejs = require("ejs");
const router = express.Router();
const db = require("../db/db.js");
const fns = require("date-fns");
const { stringify } = require("querystring");

router.use(body.json());
router.use(body.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", [
  "C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/index",
  "C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/blockchain",
  "C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/admin",
  "C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/quests",
  "C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/curency",
  "C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/games",
]);

app.use(router);

router.get("/", (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/blockchain";

  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }

  const query = req.query;
  const username = query.username;
  res.render("games_list", { username: username });
});

router.get("/ng", (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/games";

  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }

  const { username } = req.query;
  res.render("number_guesing", { username: username });
});

router.post("/ng/add", async (req, res) => {
  const { ethm } = req.body;
  const { username } = req.query;

  if (ethm == 10 || ethm == 2 || ethm == 5) {
    const s = await db.update(
      "blockchain",
      "accounts",
      { username: username },
      { $inc: { ethm: parseInt(ethm) } }
    );
    await db.insert("blockchain", "games_logs", {
      username: username,
      content: `He Won ${ethm} from random guess at ${fns.format(
        new Date(),
        "yyyy-MM-dd'T'HH:mm:ss.SSS"
      )}  `,
    });

    res.json("Success Added");
  } else {
    res.send("FRAUD FRAUD REPORTING");
    await db.update(
      "blockchain",
      "accounts",
      { username: username },
      { $set: { ban: true } }
    );
    await db.update(
      "blockchain",
      "accounts",
      { username: username },
      { $set: { ban_reason: "fraud_games" } }
    );
    await db.update(
      "blockchain",
      "accounts",
      { username: username },
      { $set: { ethm: 0 } }
    );
    await db.insert("blockchain", "fraud_warning", {
      username: username,
      type_of_fraud: "editing js from browser",
      sanction: "BAN",
    });
  }
});

router.get("/ng.js", (req, res) => {
  res.sendFile(
    "C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/games/ng.js"
  );
});

router.get("/blackjack", async (req, res) => {
  const { username } = req.query;
  const result = await db.find_one("blockchain", "accounts", {
    username: username,
  });
  res.render("blackjack", { username: username, money: result.money });
});

router.post("/slot/remove", async (req, res) => {
  const moneyrm = req.body.moneyrm;
  const money = parseInt(moneyrm);
  const username = req.body.username;

  await db.insert("blockchain", "blackjack_logs", {
    username: username,
    content: `taken ${money} from blackjack `,
    Date: `${fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS")}`,
  });
  await db.update(
    "blockchain",
    "accounts",
    { username: username },
    {
      $inc: {
        money: -parseInt(money),
      },
    }
  );
});

router.post("/slot/add", async (req, res) => {
  const moneyad= req.body.moneyad;
  const money = parseInt(moneyad);
  const username = req.body.username;
  
  await db.insert("blockchain", "blackjack_logs", {
    username: username,
    content: `give ${money} from blackjack `,
    Date: `${fns.format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS")}`,
  });
  await db.update(
    "blockchain",
    "accounts",
    { username: username },
    {
      $inc: {
        money: parseInt(money),
      },
    }
  );
});


module.exports = router;
