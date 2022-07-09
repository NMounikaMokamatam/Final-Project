var mongoose = require('mongoose');
var express = require('express'); 
var router = express.Router();
var postModel = require('../models/post');
  
// Connecting to database
var query = process.env.dbURL;
//console.log(query);
const db = (query);
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser : true, 
useUnifiedTopology: true }, function(error) {
    if (error) {
        console.log("Error!" + error);
    }
});
module.exports = router;

router.post('/save', function(req, res) {

    var newPost = new postModel();
    newPost.user_id = req.body.user_id;
    newPost.title = req.body.title;
    newPost.content = req.body.content;
    newPost.save(function(err, data){
        if(err){
            console.log(err);
        }
        else{
            console.log('Post created', data);
            res.send({ msg: "New post saved"});
        }
    });
});

router.get('/', function(req, res) {
    postModel.find(function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            console.log("All post");
            res.send(data);
        }
    });  
 });
 //load users post
 router.post('/userposts', function(req, res) {
    postModel.find({user_id: req.body.user_id},function(err, posts) {
        if(err){
            console.log(err);
        }
        else{
            console.log("Post loaded");
            res.send(posts);
        }
    });  
})

router.post('/getpost', function(req, res) {
    postModel.findOne({_id: req.body.post_id}, 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            console.log("Post data", data);
            res.send(data);
        }
    });  
});

router.delete('/delete', function(req, res) {
    postModel.deleteOne({_id: req.body.post_id}, 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            console.log("Post Deleted!", data);
            res.send({msg: 'Post deleted successfully'});
        }
    });  
});

router.post('/update', function(req, res) {

    postModel.findByIdAndUpdate(req.body.id, 
    {title:req.body.title, content:req.body.content,}, function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            console.log("Post updated!", data);
            res.send(data);   
        }
    });  
})