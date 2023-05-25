//引入cookie-parser模块
// const cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
const _modul = require('../models/User');
const User = _modul.user;
const modul = require('../models/messages');
const message = modul.message;

exports.savemessages= (req,res)=>{
    
    const {startTime,messages,endTime,_zhusu} = req.body;
    const ObjectId = getObjectId(req);
    console.log(messages);

    const _message =  new message({
        zhusu:_zhusu,
        author:ObjectId,
        content:messages,
        starttime:startTime,
        endtime:endTime,
    })
    _message.save().then(result=>{

        console.log("uploaded user")
        User.findByIdAndUpdate(ObjectId, {$push: {messages: _message._id}}, {new: true}).exec();
        return res.send({errorName : false})

    }).catch(e=>{
        console.log(e);
        console.log("save error")
    })
    console.log(startTime,messages,endTime);
    console.log(ObjectId);
    // res.clearCookie('role');
    // return res.send("ok")
}

exports.getMessages= (req,res)=>{
    const userNmae = getName(req);
    // const name = req.body.name;
    User.findOne({name: userNmae}).populate('messages').exec()
    .then(result => {
      // 处理结果
      console.log('ok');
      console.log(result.messages);
      return res.json(result.messages)
    })
    .catch(err => {
      // 处理错误
      console.log({error:err});
    });
}


const getAppCookies = (req) => {
    

    if(req.headers.cookie!== undefined){
        
        // We extract the raw cookies from the request headers 
        // req.hears.cookie = username=fafdass; userType=user; userID=j%3A%2260dec8d4c0df7743cc0b46f9%22
        // important : space after ; is require in function split
        const rawCookies = req.headers.cookie.split('; ');
        // rawCookies = ['userType=undefined', 'username=adssadsadads','userID=j%3A%2260b79335c8987e336cc68762%22"']

      
        const parsedCookies = {};
        rawCookies.forEach(rawCookie=>{
 
            const parsedCookie = rawCookie.split('=');

            // parsedCookie = {['userType', 'undefined'], ['username', 'adssadsadads'] , ['userID','j%3A%2260b79335c8987e336cc68762%22']}
        
            parsedCookies[parsedCookie[0]] = parsedCookie[1];

            //  parsedCookie = {userType: 'undefined', username: 'adssadsadads',userID: 'j%3A%2260b79335c8987e336cc68762%22'}
        });

        return parsedCookies;
    }
    else return {}
    
};

function decodeToken (token) {
    // Assuming the token is in the format "header.payload.signature"
    var payload = token.split ('.') [1]; // Get the second part
    var decoded = Buffer.from (payload, 'base64').toString (); // Decode it using Buffer
    var user = JSON.parse (decoded); // Parse it into an object
    return user;
  }

function getObjectId(req){
    const cookie = getAppCookies(req);
    const token = cookie.token;
    let user = '';
    if(token){
        user = decodeToken (token);
    }
    if(user!==''){
        let userId = user.userId;
        const idObject = new mongoose.Types.ObjectId(userId);
        // console.log(idObject);
        return idObject
    }
    return false
}

function getName(req){
    const cookie = getAppCookies(req);
    const token = cookie.token;
    let user = '';
    if(token){
        user = decodeToken (token);
    }
    if(user!==''){
        let userName = user.username;
        // console.log(idObject);
        return userName
    }
    return false
}
