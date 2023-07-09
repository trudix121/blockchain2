const express = require('express')
const app = express()
const body = require('body-parser')
const ejs = require('ejs')
const index = require('./index.js')
const blockchain = require('./blockchain.js')
const admin = require('./admin.js')
const db = require('../db/db.js')
const quests = require('./quests.js')
const curency = require('./curency.js')
const games = require('./games.js')
const cdn = require('./cdn.js')


app.use('/', index)
app.use('/blockchain', blockchain)
app.use('/admin', admin)
app.use('/quests', quests)
app.use('/curency', curency)
app.use('/games', games)
app.use('/cdn', cdn)



app.use(body.json())
app.use(body.urlencoded({ extended:true }))
app.set('view engine', 'ejs')
app.set('views', [
'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/admin',
'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/blockchain',
'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/index',
  'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/quests',
  'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/curency',
  'C:/Users/Pungesti41/Desktop/blockchain_2-0/frontend/games',


])

//db.update('blockchain', 'accounts', {}, {$set: {trans: 0 }})



app.listen(3000, ()=>{
    console.log('server started')
})