var units = require('./units');
var fs=require("fs");
var express = require('express');
var router = express.Router();
var os = require("os");

router.get('/*',function(req,res){
    var result={
        code:0,
        msg:"not handle"
    };

    config=fs.readFileSync("config.json","utf-8");
    config=JSON.parse(config);
    var key=/^\/webhook\/(\w+)\??.*$/.exec(req.originalUrl)[1];
    var project;
    if(project=config.projects[key]){
        var commands=[];
        if (os.platform()=='win32'){
            commands.push('chcp 65001');
            commands.push(project.path[0]+":");
        }
        commands.push('cd ' + project.path);
        switch (project.type){
            case "git":
                commands.push("git pull");
                break;
        }
        var extra_commands=project.commands.split("\n");
        if (extra_commands){
            for (i in extra_commands){
                extra_commands[i]=extra_commands[i].trim();
                if (extra_commands[i]){
                    commands.push(extra_commands[i]);
                }
            }
        }

        commands=commands.join(' && ');
        units.log(commands);
        require('child_process').exec(commands, function(err, out, code) {
            if (err instanceof Error) {
                result.code=500;
                result.msg=""+code;
                units.log(code+"");
            }else {
                result.code=200;
                result.msg="command run ok!";
            }
            res.json(result);
        });
    }else{
        result.code=500;
        result.msg="project not found!";
        res.json(result);
    }
});

module.exports = router;