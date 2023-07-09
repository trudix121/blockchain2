const express = require('express');
const app = express();
const body = require('body-parser')
const ejs = require('ejs');
const router = express.Router();
// const sqlite3 = require('sqlite3').verbose();
const db = require('../db/db.js')

router.use(body.json());
router.use(body.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', [
'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/admin',
'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/blockchain',
'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/index',
  'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/quests',
  'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/curency',
  'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/games',

]);

app.use(router);





router.get('/quest_1', async (req, res)=>{
    const referrer = req.headers.referer || '';
    const redirectUrl = 'http://localhost:3000/';
    
    // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
    if (!referrer.startsWith(redirectUrl)) {
      return res.status(403).send('Accesul refuzat!');
    }
    const username = req.query.username
    const result = await db.find_one('blockchain', 'accounts', {username:username})
    //console.log(result.ethm)
    res.render('quest_1.ejs', { ethm: result.ethm , username: result.username})
  
    
  })

  router.post('/quest_1', async (req, res)=>{
    const username=req.query.username
    console.log(username)
    const x = 1
    const result1 = await db.find_one('blockchain', 'accounts', {username:username})
      if(result1.easy_quest_1 === 1){
        res.send('You Already Completed this quest!')
      }
      else{
        if(req.body.Bucuresti === 'on'){
          res.redirect(`http://localhost:3000/blockchain?username=${username}`)
          await db.find_one('blockchain', 'accounts', {username:username})
          db.update('blockchain', 'accounts', {username:username}, {$set: {easy_quest_1:1}})
          db.update('blockchain', 'accounts', {username:username}, {$inc: {ethm:10}})
        }
        else{
          res.send('Answer Wrong! Try Again Later')
        }




      }
  
  
    

    
  })
  router.post('/quest_2', async (req, res)=>{
    const username=req.query.username
    console.log(username)
     
    const result1 = await db.find_one('blockchain', 'accounts', {username:username})
      if(result1.easy_quest_2 === 1){
        res.send('You Already Completed this quest!')
      }
      else{
        if(req.body.one_y === 'on'){
          res.redirect(`http://localhost:3000/blockchain?username=${username}`)
          await db.find_one('blockchain', 'accounts', {username:username})
          db.update('blockchain', 'accounts', {username:username}, {$set: {easy_quest_2:1}})
          db.update('blockchain', 'accounts', {username:username}, {$inc: {ethm:15}})
        }
        else{
          res.send('Answer Wrong! Try Again Later')
        }




      }
  
  
    

    
  })

  
router.get('/quest_2', async (req, res)=>{
  const referrer = req.headers.referer || '';
  const redirectUrl = 'http://localhost:3000/';
  
  // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
  if (!referrer.startsWith(redirectUrl)) {
    return res.status(403).send('Accesul refuzat!');
  }
  const username = req.query.username
  const result = await db.find_one('blockchain', 'accounts', {username:username})
  //console.log(result.ethm)
  res.render('quest_2.ejs', { ethm: result.ethm , username: result.username})

  
})



router.post('/quest_3', async (req, res)=>{
  const username=req.query.username
  console.log(username)
   
  const result1 = await db.find_one('blockchain', 'accounts', {username:username})
    if(result1.easy_quest_3 === 1){
      res.send('You Already Completed this quest!')
    }
    else{
      if(req.body.two_sezon === 'on'){
        res.redirect(`http://localhost:3000/blockchain?username=${username}`)
        await db.find_one('blockchain', 'accounts', {username:username})
        db.update('blockchain', 'accounts', {username:username}, {$set: {easy_quest_3:1}})
        db.update('blockchain', 'accounts', {username:username}, {$inc: {ethm:25}})
      }
      else{
        res.send('Answer Wrong! Try Again Later')
      }




    }


  

  
})


router.get('/quest_3', async (req, res)=>{
const referrer = req.headers.referer || '';
const redirectUrl = 'http://localhost:3000/';

// Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
if (!referrer.startsWith(redirectUrl)) {
  return res.status(403).send('Accesul refuzat!');
}
const username = req.query.username
const result = await db.find_one('blockchain', 'accounts', {username:username})
//console.log(result.ethm)
res.render('quest_3.ejs', { ethm: result.ethm , username: result.username})


})












module.exports = router