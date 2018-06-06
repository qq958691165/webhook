var http = require('http');
var rf=require("fs");
var server = http.createServer(function (req, res) {
    var data=rf.readFileSync("config.json","utf-8");
    data=JSON.parse(data);
    var r={
        code:0,
        msg:'no project'
    };
    res.writeHeader(200,{'Content-Type':'text/json'});
    var pro=req.url.replace('/project/','');
    if (data[pro]) {
        var commands = [
            'cd ' + data[pro],
            //'D:',//windows加盘符才能进入所需目录
            'git pull'
        ].join(' && ');
        require('child_process').exec(commands, function(err, out, code) {
            if (err instanceof Error) {
                r.code=500;
                r.msg=code;
            }else {
                r.code=200;
                r.msg='ok';
            }
            res.write(JSON.stringify(r));
            res.end();
        });
    }else{
        res.write(JSON.stringify(r));
        res.end();
    }
});
server.listen(3000);
console.log('listen at 3000');
