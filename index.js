var express = require('express');
var app = express();
var rf=require("fs");

app.get('/webhook', function (req, res) {

    var data=rf.readFileSync("config.json","utf-8");
    data=JSON.parse(data);
    var pro=req.query.pro;
    if (data[pro]){

        var commands = [
            'cd ' + data[pro],
            //'D:',//windows加盘符才能进入所需目录
            'git pull'
        ].join(' && ');

        console.log(commands);
        require('child_process').exec(commands, function(err, out, code) {
            if (err instanceof Error) {
                res.status(500);
                res.send(code);
            }else {
                res.send('ok');
            }

        });
    } else{
        res.send('pro not find');
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});