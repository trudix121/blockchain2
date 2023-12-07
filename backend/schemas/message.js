
var Schema = mongoose.Schema;

var message = new Schema({
    message:String

})

message.pre('save', async function (next){

})



// Compile model from schema
var models = mongoose.model('chatlg', message, 'chatDB' );