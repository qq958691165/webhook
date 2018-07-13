var express = require('express');
var router = express.Router();
var fs=require("fs");
var os = require("os");
var crypto=require('crypto');


var config=fs.readFileSync("config.json","utf-8");
config=JSON.parse(config);

function showInfo(res,msg,second){
    res.render('showInfo',{
        msg:msg,
        second:second
    });
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

function encode(data,key){
    var algorithm = 'aes-128-ecb';
    var clearEncoding = 'utf8';
    var iv = "";
    var cipherEncoding = 'base64';
    var cipher = crypto.createCipheriv(algorithm, key,iv);

    var cipherChunks = [];
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
}

function decode(encode,key){
    var iv = "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(encode, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
}

router.post('/login',function(req,res){
    if(req.body.password==config.password){
        req.session.islogin=true;
        req.session.enKey=guid().substring(0,16);
        res.redirect('/admin');
    }else{
        showInfo(res,'password error！please retry!',3);
    }
});

router.get('/getConfig',function (req,res) {
    var result={
        code:0,
        msg:'',
        data:null
    };
    if (req.session.islogin) {
        config = fs.readFileSync("config.json", "utf-8");
        config=JSON.parse(config);
        result.code=200;
        result.msg='get ok';
        result.data=encode(JSON.stringify(config),req.session.enKey);
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
        data=decode(req.body.data,req.session.enKey);

        fs.writeFile("config.json", data);
        result.code=200;
        result.msg='save ok';
    //     // result.data=req.body;
    }else {
        result.code=500;
        result.msg='no login';
    }
    res.json(result);
});

router.get('/restart',function (req,res) {
    var result={
        code:200,
        msg:'ok',
        data:null
    };

    if (os.platform()=='win32'){
        result.code=500;
        result.msg='this system not support';
        res.json(result);
        return false;
    }
    var commands=[];
    var pid=process.pid;
    var path=process.cwd();
    commands.push('sleep 1');
    commands.push('cd '+path);
    commands.push('kill '+pid);
    commands=commands.join(' && ');
    console.log(commands);
    res.json(result);
    require('child_process').exec(commands,function(err, out, code) {
        if (err instanceof Error) {
            console.log(code);
        }else {
            console.log('ok');
        }
    });
    commands=[];
    commands.push('sleep 2');
    commands.push('cd '+path);
    commands.push('nohup node index.js &');
    commands=commands.join(' && ');
    console.log(commands);
    require('child_process').exec(commands,function(err, out, code) {
        if (err instanceof Error) {
            console.log(code);
        }else {
            console.log('ok');
        }
    });

});

module.exports = router;