const { log } = require('console');
const inconvLitr = require('iconv-lite');
const { play } = require('./createvoice');
const fs = require('fs')




exports.chatgpt=async (req,res)=>{
    var question=req.body.question;
    var voice = '';
    console.log(req.body);
    // res.send(question)
    var spawn = require("child_process").spawn;
    var process = spawn('python',["./chatgpt.py",Buffer.from(question)],{encode:'buffer'});

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on('data',async function(data) {
        data = inconvLitr.decode(data,'cp936')
        console.log( data);
        try {
            console.log('发起请求：' + req.url)
            let res = false
            if (data) {
              res = await play(data)
              console.log('1');
              // 后端发送Base64编码的字符串
              let path = "D:/桌面/chatrobot/myapp/server_byme/test.mp3"
               // 读取本地MP3文件 
               let mp3 = fs.readFileSync(path); 
               // 转换成Base64编码 
               voice = mp3.toString("base64");    
            }
          } catch (error) {
          } 
          return res.send({mp3:voice,data:data});
    } )       
}

async function transtovoice(data){
    try {
        console.log('发起请求：' + req.url)
        let res = false
        if (data) {
          res = await play(data)
          console.log('1');
        }
        return "ok"
      } catch (error) {
        return error
      } 

}
 