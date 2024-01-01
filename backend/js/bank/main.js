const express = require('express')
const app = express()
const body = require("body-parser");
const ejs = require("ejs");
const path = require('path')
const mongoose =require('mongoose')

app.use(body.json());
app.use(body.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.set("views", [
  path.join(__dirname, 'frontend', 'login'),
  path.join(__dirname, 'frontend', 'mains'),
] );
const index = require('./routes/index') 

mongoose.set("strictQuery", false);
mongos_connect().catch((err) => console.log(err));
async function mongos_connect() {
  await mongoose.connect('mongodb+srv://blockchain:pylex@main.9fbvhcv.mongodb.net/romfar?retryWrites=true&w=majority');
  await console.log('Mongoose Connected!')
}
// routes

app.use('/', index)





//db.update('blockchain', 'accounts', {}, {$set: {level: 0 }})

app.listen(100, () => {
  console.log("Bank Server started");

});
