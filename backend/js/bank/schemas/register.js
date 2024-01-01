const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const registerschema = new Schema({
    username:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    security_code:{
        type: Number,
        required:true
    },
    ethm:{
        type:Number,
        required:true
    },
    money:{
        type:Number,
        required:true
    },
    xp:{
        type:Number,
        required:true
    }   ,
    level:{
        type:Number,
        required:true
    }

})

registerschema.pre('save', async function(next){
    const schema = this;
    schema.password = await bcrypt.hash(schema.password, 10);

    next();
});

module.exports = mongoose.model('register', registerschema, 'accounts')