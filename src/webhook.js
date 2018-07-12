var fs=require("fs");
var express = require('express');
var router = express.Router();

router.get('/*',function(req,res){
    var result={
        code:0,
        msg:"not handle"
    };

    config=fs.readFileSync("config.express.json","utf-8");
    config=JSON.parse(config);
    var key=req.originalUrl.replace('/webhook/','');
    if(config.projects[key]){
        result.code=200;
        result.msg="command run ok!";
    }else{
        result.code=500;
        result.msg="project not found!";
    }
    res.json(result);
});

module.exports = router;