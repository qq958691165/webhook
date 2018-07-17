var utils = require('./utils');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs=require("fs");

var ejs = require('ejs');
ejs.delimiter="?";

var config=fs.readFileSync("./config.json","utf-8");
config=JSON.parse(config);

var app = express();
app.use(session({
    secret: config.token,
    resave: false,
    name: 'session',
    cookie: {
        maxAge: 3600 * 1000 // 有效期，单位是毫秒
    },
    saveUninitialized: false,
    // store: new FileStore()
}));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',function(req,res){
    res.render('index');
});

app.get('/login',function(req,res){
    if(req.session.islogin){
        res.redirect('/admin');
    }else{
        res.render('login');
    }
});

app.get('/admin',function(req,res){
    if(!req.session.islogin){
        res.redirect('/login');
    }else{
        res.render('admin',{enKey:req.session.enKey});
    }
});

//api
var api=require('./api');
app.use('/api',api);

//webhook
var webhook=require('./webhook');
app.use('/webhook/*',webhook);

var server = app.listen(config.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    utils.log('Webhook listening at http://'+host+':'+port);
});