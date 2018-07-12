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

router.get('/getConfig',function (req,res) {
    var result={
        code:0,
        msg:'',
        data:null
    };
    if (req.session.islogin) {
        config = fs.readFileSync("config.express.json", "utf-8");
        config=JSON.parse(config);
        result.code=200;
        result.msg='get ok';
        result.data=config;
    }else {
        result.code=500;
        result.msg='no login';
    }
    res.json(result);
});

router.post('/setConfig',function (req,res) {
    var result={
        code:0,
        msg:'',
        data:null
    };
    if (req.session.islogin) {
        config = fs.writeFile("config.express.json", JSON.stringify(req.body.config));
        // config=JSON.parse(config);
        result.code=200;
        result.msg='save ok';
        // result.data=req.body;
    }else {
        result.code=500;
        result.msg='no login';
    }
    res.json(result);
});

module.exports = router;