const modul = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = modul.user;

exports.createUser = (req,res)=>{
    const name = req.body.userName;
    // console.log(name)
    const password = req.body.password;
    // console.log(password)

    const type = "user"
    const salt = bcrypt.genSaltSync(10);

    //检查用户名是否存在
    User.find({name: name}).then(result => {

        //如果返回一个空的Object表明用户名不存在
        if(Object.keys(result).length === 0) {
            console.log("name not found")
            
            console.log(password)

           //添加一个新的用户
                new User({
                    name,
                    password: bcrypt.hashSync(password, salt),
                    type
                }).save().then(result=>{

                    console.log("uploaded user")

                    return res.send({errorName : false})

                }).catch(e=>{
                    console.log(e);
                    console.log("save error")
                })
            
        //用户已经存在
        }else{
            console.log('用户名已经存在')
            console.log(result)
 
            return res.send({errorName: true });
            
        }
    })
    // return res.send('我已经收到了');

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

exports.loginCheck = (req,res)=>{

    
    const cookie = getAppCookies(req);
    // console.log(cookie);
    // return res.send("我收到了")
    const token = cookie.token;

    if(token === undefined || token.length===0){
        login = false
    }
    else if(token.length!=0){
        login = true
    }
    if(login) {
        // const user = cookie;
        return res.json({login})    
    }
    else return res.json({login})
    
}

exports.logOut= (req,res)=>{
    res.clearCookie('token');
    // res.clearCookie('role');
    return res.json({logout:true})
}

// 定义一个函数生成令牌 
function generateToken(user) {
     // 使用jwt.sign方法签名一个令牌，传入用户信息，密钥和过期时间 
     return jwt.sign(user,'shhhhh', { expiresIn: '1800s' }); 
    }


exports.login=(req,res) => { // 获取请求体中的用户名和密码 
    const { userName, password } = req.body;
    console.log(userName);
    // return res.send("我收到了")
    let role = ''
    // console.log(password);
    // console.log(req.body);
    // 如果用户名或密码为空，返回400状态码和错误信息 
    if (!userName || !password) { 
        return res.status(400).json({ error: 'Please provide username and password' }); 
    }
    // 使用数据库连接查询用户表，根据用户名查找用户信息 
    User.find({name: userName})
    .then(result => {
        // console.log(result[0].password);
        //如果返回一个空的object表明用户名不存在
        let hashpassword = result[0].password;
        role = result[0].type;
        let userId = result[0]._id;
        if(Object.keys(result).length === 0) {
            console.log("name not found")
            // console.log(password)
            return res.status(400).json({ error: 'Username has not be registed' }); 
        }
        else{
            bcrypt.compare(password, hashpassword, 
                (err, result) => { 
                    // 如果出错，处理错误 
                    if (err) { 
                        console.log(err);
                    }

                    // 如果结果为true，说明密码匹配 
                    if (result) { 
                        // 如果密码匹配，生成一个令牌，传入用户的用户名和角色
                        const token = generateToken({ username:  userName, role:  role ,userId:userId});

                        // 返回200状态码和令牌
                        return res.status(200).json({ token });
                        // console.log('登录成功');
                    }
                    else { 
                        // 如果结果为false，说明密码不匹配 
                        // TODO: send error message 
                        // console.log('登录失败');
                        return res.status(400).json({ error: '密码不匹配' }); 
                    } });
        }
     });
    }
   