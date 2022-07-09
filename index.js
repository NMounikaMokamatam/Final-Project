require('dotenv').config();
const express = require("express");
const app= express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser=require('body-parser');
const usersRoutes = require('./server/routes/users');
const postsRoutes = require('./server/routes/posts');
const auth = require('./server/models/auth');

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.get('/', (req,res) => res.sendFile(path.join(__dirname, '/public', 'index.html')));
app.use(cors({ credentials:true, origin:'https://furrypuppy.herokuapp.com' }));
app.use(cookieParser());
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));
// Parses the text as url encoded data
app.use(bodyParser.urlencoded({extended: true})); 
// Parses the text as json
app.use(bodyParser.json()); 
app.use('/api/users', usersRoutes);
app.use('/api/posts',auth, postsRoutes);