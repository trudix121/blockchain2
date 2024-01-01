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
  "../../frontend/admin",
  "  ../../frontend/blockchain",
  "  ../../frontend/index",
  "  ../../frontend/quests",
  "  ../../frontend/curency",
  "  ../../frontend/games",
  "../../frontend/chat",
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

  const result = await db.find("blockchain", "accounts", {
    username: username,
  });

  if (result.length > 0) {
    const user = result[0]; // Access the first element of the array

    if (user.battlepass == 1) {
      const s = await db.update(
        'blockchain',
        'accounts',
        { username: username },
        {
          $inc: {
            ethm: parseInt(ethm),
            xp: 10,
            ng_played: 1
          }
        }
      );
      res.json("Success Added");
    } else {
      const s = await db.update(
        "blockchain",
        "accounts",
        { username: username },
        { $inc: { ethm: parseInt(ethm), xp: 10 } }
      );
      await db.insert("blockchain", "games_logs", {
        username: username,
        content: `He Won ${ethm} from random guess at ${fns.format(
          new Date(),
          "yyyy-MM-dd'T'HH:mm:ss.SSS"
        )}  `,
      });

      res.json("Success Added");
    }
  } else {
    res.send("User not found");
    // Handle the case when no user is found with the specified username
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

router.post("/bk/remove", async (req, res) => {
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

router.post("/bk/add", async (req, res) => {
  const moneyad = req.body.moneyad;
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
        xp: 20,
      },
    }
  );
});

module.exports = router;
