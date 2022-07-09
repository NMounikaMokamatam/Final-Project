var mongoose = require('mongoose');
var express = require('express'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var router = express.Router();
var userModel = require('../models/user');
  
// Connecting to database
var query = process.env.dbURL
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

router.post('/register', function(req, res) {
    //console.log('Post req data',req.body);
    //check user if exist
    userModel.findOne({email: req.body.email}, 
        function(err, user) {
            if(err){
                console.log(err);
            }
            else{
                console.log("User data", user);
                if(!user){
                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(req.body.password, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                            }
                            else{  
                                var newSUser = new userModel();
                                newSUser.username = req.body.username;
                                newSUser.email = req.body.email;
                                newSUser.password = hash;
                                newSUser.refresh_token = null;     
                                newSUser.user_id = req.body.email;
                                //save now user
                                newSUser.save(function(err, data){
                                    if(err){
                                        console.log(err);
                                    }
                                    else{
                                        console.log('User created', data);
                                        //data = { ...data, password: undefined};
                                        res.send({ msg: "User registered you can now log in"});
                                        return
                                    }
                                });
                            }
                        });
                    });

                }
                else{
                    res.status(404).json({msg:"Email taken please use a diffent one"});
                    return
                }
            }
        });           
});

router.post('/login', function(req, res) {

    if((req.body.email == null )&& (req.body.password == null) ){
        res.status(404).json({msg:"Note allowed"});
        return
    }

    userModel.findOne({email: req.body.email}, 
    function(err, user) {
        if(err){
            console.log(err);
        }
        else{
            console.log("User data", user);
            if(!user){
                res.status(404).json({msg:"User not found"});
                return
            }

            bcrypt.compare(req.body.password, user.password, function(err, result) {
                // result == true
                if(err){
                    console.log(err);
                }
                else{
                    if(result){

                        const user_id = user.user_id;
                        const user_name = user.username;
                        const email = user.email;
                        const userData = {user_id, user_name, email};
                        const access_token = jwt.sign(userData, process.env.JWT_ACCESS_SECRET,{
                            expiresIn: '2m'
                        });
                        const refresh_token = jwt.sign(userData, process.env.JWT_REFRESH_SECRET,{
                            expiresIn: '1d'
                        });
                        userModel.findOneAndUpdate({email: email}, 
                            { refresh_token : refresh_token}, function(err, data) {
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    console.log('User signed in');
                                    res.cookie('refresh_token', refresh_token,{
                                        httpOnly: true,
                                        maxAge: 24 * 60 * 60 * 1000
                                    }).send({ accessToken: access_token });
                                    return   
                                }
                            }); 
                    }
                    else{
                        console.log('Bcytpt', user);    
                        res.status(404).json({msg:"Invalid password"});
                        return
                    }
                }
            });
            
        }
    });  
});

router.get('/getusers', function(req, res) {
    userModel.find(function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            console.log("All users");
            res.send(data);
        }
    });  
 });

router.post('/getuser', function(req, res) {
    userModel.findOne({email: req.body.email}, 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            console.log("User data", data);
            res.send(data);
        }
    });  
});

router.post('/delete', function(req, res) {
    userModel.remove({email: req.body.email}, 
    function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            console.log("User Deleted!", data);
            res.send(data);
        }
    });  
});

router.post('/updateuser', function(req, res) {
     /*
    user_id:Number,
    username:String,
    email:String,
    password:String,
    */
    userModel.findByIdAndUpdate(req.body.id, 
    {username:req.body.username, email:req.body.email,}, function(err, data) {
        if(err){
            console.log(err);
        }
        else{
            console.log("User updated!", data);
            res.send(data);   
        }
    });  
})

router.get('/gettoken', function(req, res) {
    try {
        const refresh_token = req.cookies.refresh_token;
        if(!refresh_token) return res.sendStatus(401);

        userModel.findOne({refresh_token: refresh_token}, 
            function(err, user) {
                if(err){
                    console.log(err);
                }
                else{
                    if(!user){
                        return res.sendStatus(403);
                    }
                    jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
                        if(err) return res.sendStatus(403);
                        const user_id = user.user_id;
                        const user_name = user.username;
                        const email = user.email;
                        const userData = {user_id, user_name, email};
                        const accessToken = jwt.sign(userData, process.env.JWT_ACCESS_SECRET);
                        res.json({ accessToken });
                    });
                }
        });

    } catch (error) {
        console.log(error);
    }  
})

router.get('/logout', function(req, res) {
    const refreshToken = req.cookies.refresh_token;
    if(!refreshToken) return res.sendStatus(204);
    userModel.findOne({refresh_token: refreshToken}, 
        function(err, user) {
            if(err){
                console.log(err);
            }
            else{
                if(!user){
                    return res.sendStatus(204);
                }
                userModel.findOneAndUpdate({email: user.email}, 
                    { refresh_token : null}, function(err, data) {
                        if(err){
                            console.log(err);
                        }
                        else{
                            res.clearCookie('refresh_token');
                            return res.sendStatus(200);  
                        }
                    }); 
            }
        });

})