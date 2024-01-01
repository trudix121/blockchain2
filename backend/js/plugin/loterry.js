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
const fs = require("fs");

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
]);

app.use(router);
const lottery =   require("../../utils/loterry_generator.js");
const lotterynb = require('../../schemas/loterry_register.js')

router.get("/", async (req, res) => {
  // Calea către fișierul .txt
  const referrer = req.headers.referer || "";
  const redirectUrl = "http://localhost:3000/games";

  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send("Accesul refuzat!");
  }

  const ziCurenta = new Date();
  if (ziCurenta.getHours() === 19) {
    // Generează numere câștigătoare și salvează-le în MongoDB
    const numereCastigatoare = lottery()
    const extragere = lotterynb.create({
        numereCastigatoare: numereCastigatoare
    })
    
    res.render('lottery', {numbers:numereCastigatoare})
  } else {
    res.render('lottery',{numbers:1});
  }
});

module.exports = router;
