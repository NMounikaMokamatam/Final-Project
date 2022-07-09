var mongoose=require('mongoose');  
var PostSchema = new mongoose.Schema({
    user_id:{ type: String, required: true},       
    title:{ type: String, required: true},
    content:{ type: String, required: true},
});
module.exports = mongoose.model('post', PostSchema, 'posts');