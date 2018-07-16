var cp=require('child_process');
var fs=require("fs");

var child;

log=function (msg) {
    var date=new Date();
    date=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDay()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    fs.appendFileSync('./log',date+'::::'+msg);
};

function start(){
    child=cp.fork('./src/app.js');
    child.on('message',function (msg) {
        if (msg == 'restart-app') {
            child.kill();
            start();
        }
    });
}
start();