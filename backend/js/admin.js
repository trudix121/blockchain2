const express = require('express')
const app = express()
const body = require('body-parser')
const ejs = require('ejs')
const router = express.Router()
const db = require('../db/db.js')
const { timeEnd } = require('console')



router.use(body.json())
router.use(body.urlencoded({ extended:true }))
app.set('view engine', 'ejs')
app.set('views', [
    '../../frontend/admin',
    '  ../../frontend/blockchain',
    '  ../../frontend/index',
    '  ../../frontend/quests',
    '  ../../frontend/curency',
    '  ../../frontend/games',
    "../../frontend/chat"

])

app.use(router)


router.get('/panel', async (req, res)=>{
    const referrer = req.headers.referer || '';
    const redirectUrl = 'http://localhost:3000/admin';
    
    // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
    if (!referrer.startsWith(redirectUrl)) {
      return res.status(403).send('Accesul refuzat!');
    }
    res.render('C:/Users/Pungesti41/Desktop/blockchain_2-0-main/frontend/admin/admin_main.ejs')


    
})

router.get('/', (req, res)=>{
    res.render('C:/Users/Pungesti41/Desktop/blockchain_2-0-main/frontend/admin/admin_login.ejs')
})


router.post('/',async  (req, res)=>{
    const {username, password} = req.body
    const result = await db.find_one('blockchain', 'admin_data', {username:username, password:password})
    .then((result)=>{
        if(result){
            res.redirect('http://localhost:3000/admin/panel')

        }
        else{
            res.send('Account Don t Exist')
        }
    })
})

router.post('/add', async (req, res)=>{
    const {user, sum} = req.body
    // verify if user exist
    await db.find_one('blockchain', 'accounts', {username:user})
    .then((result)=>{
        if(result){
            db.update('blockchain', 'accounts', {username:user}, {$inc: { ethm: parseInt(sum)}})
            res.send('Succes')

        }
        else{
            res.send('User Not Found')
        }

    })
})

router.get('/leaderboard', async (req, res) => {

    const referrer = req.headers.referer || '';
    const redirectUrl = 'http://localhost:3000/admin';
    
    // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
    if (!referrer.startsWith(redirectUrl)) {
      return res.status(403).send('Accesul refuzat!');
    }
    try {
      const players = await db.find('blockchain', 'accounts', {}); // Modify the database and collection names accordingly
      res.render('C:/Users/Pungesti41/Desktop/blockchain_2-0-main/frontend/admin/leaderboard.ejs', { players });
    } catch (error) {
      console.error('Failed to retrieve leaderboard data:', error);
      res.render('C:/Users/Pungesti41/Desktop/blockchain_2-0-main/frontend/admin/leaderboard.ejs', { players: [] }); // Render the template with an empty array if an error occurs
    }
  });
  

router.post('/gift', async (req, res)=>{
    const referrer = req.headers.referer || '';
    const redirectUrl = 'http://localhost:3000/admin';
    
    // Verifică dacă Gigel a fost redirecționat de pe localhost:3000/
    if (!referrer.startsWith(redirectUrl)) {
      return res.status(403).send('Accesul refuzat!');
    } 
    const body =  req.query
    await db.find_one('blockchain', 'accounts', {username:body.username})
    .then((result)=>{
        if(result){
            db.update('blockchain', 'accounts', {username:body.username}, {$inc: {ethm: 10}})
            res.send('Succes')
        }
        else{
            res.send('User Not found')
        }
    })
})

router.post('/ban', async (req, res)=>{
    const {user, reason} = req.body

    await db.find_one('blockchain', 'accounts', {username:user})
    .then((result)=>{
        if(result){
            db.update('blockchain', 'accounts', {username:user}, {$set: {ban:true, ban_reason:reason}})
            res.send('Succes banned')
        }
        else{
            res.send('User Not found')
        }
    })
    

})
router.post('/unban', async (req, res)=>{
    const {user, reason} = req.body

    await db.find_one('blockchain', 'accounts', {username:user})
    .then((result)=>{
        if(result){
            db.update('blockchain', 'accounts', {username:user}, {$set: {ban:false, unban_reason:reason}})
            res.send('Succes Unbanned')
        }
        else{
            res.send('User Not found')
        }
    })
    

})


module.exports = router