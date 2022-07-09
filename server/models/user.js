var mongoose=require('mongoose');
//user data schema
var UserSchema = new mongoose.Schema({
    username:{ type: String, required: true},
    email:{ type: String, unique: true, required: true},
    password:{ type: String, required: true},
    refresh_token:String, //after login
    user_id: { type: String, unique: true, required: true},
});
module.exports = mongoose.model('user', UserSchema, 'users');