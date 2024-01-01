const express = require("express");
const app = express();
const body = require("body-parser");
const ejs = require("ejs");
const index = require("./index.js");
const blockchain = require("./blockchain.js");
const admin = require("./admin.js");
const db = require("../db/db.js");
const quests = require("./quests.js");
const curency = require("./curency.js");
const games = require("./games.js");
const cdn = require("./cdn.js");
const { fork } = require("node:child_process");
const chat = require('./chat.js');

// plugins
const battlepass = require('./plugin/battlepass.js')
const informations = require('./plugin/informations.js')
const lottery = require('./plugin/loterry.js')


app.use("/", index);
app.use("/blockchain", blockchain);
app.use("/admin", admin);
app.use("/quests", quests);
app.use("/curency", curency);
app.use("/games", games);
app.use("/cdn", cdn);
app.use("/chat", chat);

//plugins routers
app.use('/blockchain/battlepass', battlepass)
app.use('/informations', informations)
//app.use('/blockchain/loterry', lottery)

app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", [
  "../../frontend/admin",
  "  ../../frontend/blockchain",
  "  ../../frontend/index",
  "  ../../frontend/quests",
  "  ../../frontend/curency",
  "  ../../frontend/games",
  "../other/battlepass_html"


]);

//db.update('blockchain', 'accounts', {}, {$set: {level: 0 }})

app.listen(3000, () => {
  console.log("Server started");
  fork('C:/Users/Pungesti41/Desktop/blockchain_2-0-main/backend/websocket/websocket.js')
  fork('C:/Users/Pungesti41/Desktop/blockchain_2-0-main/backend/js/bank/main.js')

});
