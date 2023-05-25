const express = require('express'),
      bodyParser = require('body-parser'),
      spawn = require('child_process').spawn;
const { write } = require('fs');
// const inconvLitr = require('iconv-lite');
const { encode } = require('punycode');
const mongoose = require("mongoose");
const cors = require('cors')
const { play } = require('../server_byme/modelcontrollers/createvoice');

const app=express()
const routers = require("./routers/appRouter");

app.use(cors())
// const utf8 = require('utf8');
// const decoder = new StringDecoder('utf-8');
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(routers);


app.listen(port,()=>{
    console.log('listen on port 3000');
})
 
// app.post('/chatgpt',chatgpt)

// function chatgpt(req,res){
//     var question=req.body.question;
//     console.log(req.body);
//     // res.send(question)
//     var spawn = require("child_process").spawn;
//     var process = spawn('python',["./chatgpt.py",Buffer.from(question)],{encode:'buffer'});

//     // Takes stdout data from script which executed
//     // with arguments and send this data to res object
//     process.stdout.on('data', function(data) {
//         data = inconvLitr.decode(data,'cp936')
//         // console.log( data);
//         res.send(data);
//     } )       
         
// }