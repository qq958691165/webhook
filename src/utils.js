var fs=require("fs");

var utils={};

utils.log=function (msg) {
    var date=new Date();
    date=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDay()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    fs.appendFileSync('./log',date+'|----|'+msg+'\r\n');
};

module.exports=utils;