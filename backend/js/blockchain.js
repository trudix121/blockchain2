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

router.get("/", async (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }
  const username = req.query.username;
  const result = await db.find_one("blockchain", "accounts", {
    username: username,
  });
  //console.log(result.ethm)
  res.render("main", {
    ethm: result.ethm,
    username: result.username,
    email: result.email,
    cvv: result.security_code,
    money: result.money,
  });
});
router.get("/transfer", async (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }
  const username = req.query.username;
  const result = await db.find_one("blockchain", "accounts", {
    username: username,
  });
  //console.log(result.ethm)
  res.render("transfer", { ethm: result.ethm, username: result.username });
});

router.get("/earn_ethm", async (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }
  const username = req.query.username;
  const result = await db.find_one("blockchain", "accounts", {
    username: username,
  });
  //console.log(result.ethm)
  res.render("earn_ethm", { ethm: result.ethm, username: result.username });
});

router.post("/transfer", async (req, res) => {
  const { sum, user_transfer, sec_code } = req.body;
  const username = req.query.username;
  const result = await db.find_one("blockchain", "accounts", {
    username: username,
  });

  /*console.log(result.ethm);
  console.log(result.security_code);
  console.log(`sec = ${sec_code}`);*/

  // Verify if user has the required number of ethm

  if (result.ban == true) { 
    res.send(`You are banned with reason ${result.ban_reason}`);
  } else {
    if (result.ethm < sum) {
      res.send(`You don't have ${sum} ethm.`);
    } else {
      const userAccount = await db.find("blockchain", "accounts", {
        username: user_transfer,
      });
      if (userAccount) {
        const securityCode = parseInt(result.security_code);
        const submittedCode = parseInt(sec_code);

        if (securityCode === submittedCode) {
          await db.insert("blockchain", "transfer_logs", {
            log: `New Transfer, Date: ${formattedDate}, user_sender: ${username}, user_receiver: ${user_transfer}, sum of ethm: ${sum}`,
          });

          db.update(
            "blockchain",
            "accounts",
            { username: user_transfer },
            { $inc: { ethm: parseInt(sum) } }
          );
          db.update(
            "blockchain",
            "accounts",
            { username: username },
            { $inc: { ethm: -parseInt(sum) } }
          );

          res.redirect(`http://localhost:3000/blockchain?username=${username}`);
        } else {
          res.send("Invalid security code.");
        }
      } else {
        res.send(
          `The user you want to transfer ${sum} ethm to does not have an account.`
        );
      }
    }
  }
});

router.get("/shop", async (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }
  const username = req.query.username;
  const result = await db.find_one("blockchain", "accounts", {
    username: username,
  });
  //console.log(result.ethm)
  res.render("shop", { ethm: result.ethm, username: result.username });
});
router.get("/shop/buy", async (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }

  const { item, username } = req.query;

  const prices = [
    (pro_badge = 100),
    (beginner_badge = 25),
    (semi_beginner = 50),
    (battlepass = 1000)
    
  ];

  try {
    const result = await db.find_one("blockchain", "accounts", {
      username: username,
    });
    console.log(result)
    if (item === "pro_badge") {
      if (result.ethm < prices[0]) {
        res.send(`You Dont have ${prices[0]} ethm to buy Badge!`);
      } else {
        if (result.pro_badge === 1) {
          res.send("You Already have badge");
        } else {
          db.update(
            "blockchain",
            "accounts",
            { username: username },
            { $inc: { ethm: -parseInt(prices[0]) } }
          );
          db.update(
            "blockchain",
            "accounts",
            { username: username },
            { $set: { pro_badge: 1 } }
          );
          res.send("Succes");
        }
      }
    }
    if (item === "semi_beginner") {
      if (result.ethm < prices[2]) {
        res.send(`You Dont have ${prices[1]} ethm to buy Badge!`);
      } else {
        if (result.semi_beginner === 1) {
          res.send("You Already have badge");
        } else {
          db.update(
            "blockchain",
            "accounts",
            { username: username },
            { $inc: { ethm: -parseInt(prices[2]) } }
          );
          db.update(
            "blockchain",
            "accounts",
            { username: username },
            { $set: { semi_beginner: 1 } }
          );
          res.send("Succes");
        }
      }
    }
    if (item === "beginner_badge") {
      if (result.ethm < prices[1]) {
        res.send(`You Dont have ${prices[1]} ethm to buy Badge!`);
      } else {
        if (result.beginner_badge === 1) {
          res.send("You Already have badge");
        } else {
          db.update(
            "blockchain",
            "accounts",
            { username: username },
            { $inc: { ethm: -parseInt(prices[1]) } }
          );
          db.update(
            "blockchain",
            "accounts",
            { username: username },
            { $set: { beginner_badge: 1 } }
          );
          res.send("Succes");
        }
      }
    }
    if (item === "battlepass") {
      if (result.ethm < prices[3]) {
        res.send(`You Dont have ${prices[3]} ethm to buy Badge!`);
      } else {
        if (result.battlepass === 1 || result.battlepass===2) {
          res.send("You Already have battlepass!");
        } else {
          db.update('blockchain', 'accounts', {username:username}, {
            '$inc':{

              ethm: -parseInt(prices[3])
            },
            '$set':{
              'battlepass': 1,
              'ng_played':0,
              'ethm_sell':0,
              'ethm_buyed':0,
            }
          })
          db.insert('battle_pass', 'december', {
            username:username,
            mission_1: 0,
            mission_2: 0,
            mission_3: 0,
            mission_4: 0,
            mission_5: 0,
            finished:0

          })
          res.send("Succes");
        }
      }
    }
  } catch {}
});

router.get("/badges", async (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }

  const username = req.query.username;

  const result = await db.find_one_badges("blockchain", "accounts", {
    username: username,
  });
  res.render("badges", {
    ethm: result.ethm,
    username: result.username,
    badges: result.badges,
  });
});

router.get("/profile", async (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }

  const original_username = req.query.username;

  const result = await db.find_one("blockchain", "accounts", {
    username: original_username,
  });

  // Check if result.ethm is defined before parsing;


  res.render("your-profile", {
    username_profile: result.username,
    ethm_profile: result.ethm,
    email_profile: result.email,
    money_profile: result.money,
    user_level: result.level,
    username: original_username,
    xp: result.xp,
  });
  console.log(result.level)
});

router.post("/search-profile", async (req, res) => {
  const searched_username = req.body.searched_username;

  const { original_username } = req.query;
  const data = await db.find_one('blockchain', 'accounts', {username:original_username})
  const result = await db
    .find_one("blockchain", "accounts", { username: searched_username })
    .then(async (result) => {
      if (result) {
        // Check if result.ethm is defined before parsing
        const ethmProfile = result.ethm !== undefined ? parseInt(result.ethm) : 0;

        res.render("your-profile", {
          username_profile: result.username,
          ethm_profile: ethmProfile,
          email_profile: result.email,
          money_profile: result.money,
          user_level: result.level,
          username: original_username,
          xp: data.xp
        });
      } else {
        res.render("your-profile", {
          username_profile: "Profile Not Found",
          ethm_profile: "Profile Not Found",
          email_profile: "Profile Not Found",
          money_profile: "Profile Not Found",
          username: original_username,
        });
      }
    });
});

router.get("/link", async (req, res) => {
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }

  const username1 = req.query.username;
  const username = db.find_one("blockchain", "accounts", {
    username: username1,
  });

  res.render("link", { username: req.query.username, ethm:username.ethm });
});

router.post("/get_code", async (req, res) => {

  const username = req.query.username;
  const data  = await db.find_one('blockchain', 'accounts', {username:username})
  function generate_code() {
    return Math.floor(Math.random() * 100000) + 1;
  }
    
    
  if(data.discord_code == null){

          await db.update('blockchain', 'accounts', {username:username}, {$set:{
      discord_code:generate_code()
      
    }})
      const credits = await db.find_one('blockchain', 'accounts', {username:username})
      res.send(`Succes Your Discord Link Code is ${credits.discord_code} For username Trudix`)
  }  
  else{
      const code = await db.find_one('blockchain', 'accounts', {username:username})
          res.send(`You already have a code generated code: ${code.discord_code} `)
  }
});

router.post('/levelup', async (req, res) => {
  const username = req.query.original_username;

  try {
    const data = await db.find_one('blockchain', 'accounts', { username: username });
    
    if (!data) {
      return res.status(404).send('User not found');
    }

    const xp = data.xp;
    const currentLevel = data.level || 0; // Set a default value if level is undefined
    const ethmPerLevelUp = 10;

    if (xp >= 100) {
      const ethmReward = ethmPerLevelUp * (currentLevel + 1);

      await db.update('blockchain', 'accounts', { username: username }, {
        $inc: {
          xp: -100,
          level: 1,
          ethm: ethmReward
        }
      });

      res.send(`Success! You leveled up to level ${currentLevel + 1}. You received ${ethmReward} ethm.`);
    } else {
      res.send('You don\'t have enough xp points');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/missions_verify',async (req,res)=>{
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }

const data = await db.find_one('blockchain', 'accounts', {username:req.query.username})
const bp = await db.find_one('battle_pass', 'december', {username:req.query.username})


let mission_1;
let mission_2;
let mission_3;
let mission_4;
let mission_5;
let final;
console.log(data.ethm_buyed)
console.log(data.ethm_sell)

if(data.ethm_buyed >= 50){
  if(bp.mission_1 == 1){

  }
  else{
    db.update('battle_pass', 'december', {username:req.query.username}, {
      '$set':{mission_1: 1}
    })
    db.update('blockchain', 'accounts', {username:req.query.username}, {
      '$inc': {ethm:80}
    })
    mission_1 = 'completed'
    console.log('debug')
  }



}
if(data.ethm_sell >= 100){

  if(bp.mission_2 == 1){
  }
  else{
    db.update('battle_pass', 'december', {username:req.query.username}, {
      '$set':{mission_2: 1}
    })
    db.update('blockchain', 'accounts', {username:req.query.username}, {
      '$inc': {ethm:120}
    })
    mission_2 = 'completed'
    console.log('debug1')

  }



}
if(data.ng_played >= 5){
  if(bp.mission_3!= 1){
    db.update('battle_pass', 'december', {username:req.query.username}, {
      '$set':{mission_3: 1}
    })
    db.update('blockchain', 'accounts', {username:req.query.username}, {
      '$inc': {ethm:200}
    })
    mission_3 = 'completed'
  }



}

if(data.ng_played >= 10){
  if(bp.mission_4!= 1){
    db.update('battle_pass', 'december', {username:req.query.username}, {
      '$set':{mission_4: 1}
    })
    db.update('blockchain', 'accounts', {username:req.query.username}, {
      '$inc': {ethm:500}
    })
    mission_4 = 'completed'
  }



}
if(data.discord_connected === 1){
  if(bp.mission_5!= 1){
    db.update('battle_pass', 'december', {username:req.query.username}, {
      '$set':{mission_5: 1}
    })
    db.update('blockchain', 'accounts', {username:req.query.username}, {
      '$inc': {ethm:100}
    })
    mission_5 = 'completed'
  }



}

if (bp.mission_1 == 1 & bp.mission_2 == 1 & bp.mission_3 == 1 & bp.mission_4 == 1 & bp.mission_5 == 1) {
  db.update('battle_pass', 'december', { username: req.query.username }, {
    '$set': { finished: 1 }
  })
  db.update('blockchain', 'accounts', { username: req.query.username }, {
    '$inc': { ethm: 900 },
    '$set': { battlepass: 2 }
  })
  res.send('Congrats! You complete battlepass , you receive in total 1900 ethm')
} else {
  res.send('Verified , refresh battlepass page to see result of missions!')
}

})

router.get('/daily_reward', async (req, res) => {
  const userId = req.query.username;
  const datefns = require('date-fns');
  const now = new Date();

  const datas = await db.find_one('blockchain', 'dailyRewards', { username: userId }).then(async (data) => {
    if (data == null) {
      // User hasn't claimed the reward yet today
      await db.update('blockchain', 'accounts', { username: userId }, { $inc: { ethm: 10 } });
      await db.insert('blockchain', 'dailyRewards', {
        username: userId,
        day: now,
      });
      res.send('Daily Reward collected!');
    } else {
      // User has claimed the reward today
      if (datefns.isSameDay(data.day, now)) {
        res.send('Daily Reward Already Claimed for today!');
      } else {
        // User hasn't claimed the reward yet today
        await db.update('blockchain', 'accounts', { username: userId }, { $inc: { ethm: 10 } });
        await db.update('blockchain', 'dailyRewards', { username: userId }, { $set: { day: now } });
        res.send('Daily Reward collected!');
      }
    }
  });
});


module.exports = router;
