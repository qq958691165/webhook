var cp=require('child_process');
var fs=require("fs");

var config=fs.readFileSync("./config.json","utf-8");
config=JSON.parse(config);

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
console.log('Server is running,listening port:'+config.port);
if (process.env.TEST){
    setTimeout(()=>{
        process.exit(0);
    },3000);
    start();
} else {
    start();
}