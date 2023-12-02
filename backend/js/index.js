const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const body = require('body-parser')
const ejs = require('ejs');
const router = express.Router();
const mailer = require('nodemailer')
const db = require('../db/db.js')

const { generateRandomNumber } = require('../utils/generateRandomNumber.js'); // Adaugă funcțiile de utilitate dintr-un fișier separat (utils.js)
const { isCodeValid } = require('../utils/isCodeValid.js')

router.use(body.json());
router.use(body.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', [
  '../../frontend/admin',
'  ../../frontend/blockchain',
'  ../../frontend/index',
'  ../../frontend/quests',
'  ../../frontend/curency',
'  ../../frontend/games',
"../../frontend/chat"

]);

app.use(router);

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.find_one('blockchain', 'accounts', { email: email, password: password });



      if (result) {
        if(result.ban == true){
          res.send(`You Are Banned, with reason ${result.ban_reason}`)
        }
        else{
          res.redirect(`/blockchain?username=${result.username}`);

          
        }
      } else {
        res.send('Account not found/Credientials Incorect');
      }


    }

   catch (error) {
    console.log(error);
    res.send('An error occurred');
  }
});

router.post('/register', (req, res) => {
  const { email, username, password, security_code } = req.body;

  db.find_one('blockchain', 'accounts', { email: email })
    .then((result) => {
      if (result) {
        res.send('Email is already in use');
      } else {
        db.find_one('blockchain', 'accounts', { username: username })
          .then((result) => {
            if (result) {
              res.send('Username is already in use');
            } else {
              db.insert('blockchain', 'accounts', {
                email: email,
                username: username,
                password: password,
                security_code: security_code,
                ethm: 15,
                money: 0,
                buy_limit: 9,
                tranzaction: 0,
                xp: 0,

              }).then(() => {
                res.redirect('/');
              });
            }
          });
      }
    });
});

var transporter = mailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  secure: false,
  auth: {
    user: 'metin2smekerie@gmail.com',
    pass: 'gtdrsdzfnjwyfjpx',
  }
});

router.get('/forgot-password', (req, res) => {
  res.render('forgot-pass');
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  function generateRandomNumber(length) {
    let min = 10 ** (length - 1);
    let max = 10 ** length - 1;
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    let timestamp = Date.now(); // Momentul generării codului
    return { code: randomNum, timestamp: timestamp };
  }

  db.find_one('blockchain', 'accounts', { email: email })
    .then((result) => {
      if (result) {
        const { code, timestamp } = generateRandomNumber(6); // Generare cod și timestamp
        const expirationTime = 5 * 60 * 1000; // Timp de expirare: 5 minute

        db.update('blockchain', 'accounts', { email: email }, { $set: { reset_code: code, reset_code_timestamp: timestamp } })
          .then(() => {
            var mailOptions = {
              from: 'metin2smekerie@gmail.com',
              to: email,
              subject: 'Password Reset',
              text: `Your password reset code is ${code}. It is valid for 5 minutes.`,
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });

            res.render('succes-forgot1', { successMessage: 'A password reset code has been sent to your email address.' });
          });
      } else {
        res.render('succes-forgot1', { errorMessage: 'Account not found' });
      }
    });
});

router.get('/forgot-password-succes', (req ,res)=>{
  res.render('succes-forgot1')
  const referrer = req.headers.referer || '';
  const redirectUrl = 'http://localhost:3000/forgot-password';
  
  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send('Accesul refuzat!');
  }
})

router.post('/forgot-password-success',async  (req, res) => {
  const { email, code, newPassword } = req.body;
  //console.log(req.body)


  await db.find_one('blockchain', 'accounts', {email:email})
  .then(async (result)=>{
    if(result){
      if(result.reset_code == code){
        await db.update('blockchain', 'accounts', {email:email}, {$set:{password:newPassword}})
 //console.log('true')
 res.redirect('http://localhost:3000/')
      }
      else{
        res.send('Code is incorect')
      }
    }
    else{
      console.log('debug1')
    }
  })});

module.exports = router;
