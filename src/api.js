var express = require('express');
var router = express.Router();
var fs=require("fs");

var config=fs.readFileSync("config.express.json","utf-8");
config=JSON.parse(config);

function showInfo(res,msg,second){
    res.render('showInfo',{
        msg:msg,
        second:second
    });
}

router.post('/login',function(req,res){
    if(req.body.password==config.password){
        req.session.islogin=true;
        res.redirect('/admin');
    }else{
        showInfo(res,'密码错误！请重试!',3);
    }
});



module.exports = router;