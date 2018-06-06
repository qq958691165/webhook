var http = require('http');
var rf=require("fs");
var server = http.createServer(function (req, res) {
    res.writeHeader(200, {'Content-type': 'text/html; charset=utf-8',});
    var data=rf.readFileSync("config.json","utf-8");
    data=JSON.parse(data);
    var pro=req.url.replace('/project/','');
    if (data[pro]) {
        var commands = [
            'cd ' + data[pro],
            //'D:',//windows加盘符才能进入所需目录
            'git pull'
        ].join(' && ');
        require('child_process').exec(commands, function(err, out, code) {
            if (err instanceof Error) {
                console.log(code);
                res.write(code);
                res.end();
            }else {
                res.write('ok');
                res.end();
            }
        });
    }else{
        res.write('project not found,please fetch "/project/[project name]"');
        res.end();
    }
});
server.listen(3000);
console.log('listen at 3000');
