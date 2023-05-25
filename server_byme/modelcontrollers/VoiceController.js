const { play } = require('./createvoice');

exports.Voice= async (req,res)=>{
    try {
        console.log('发起请求：' + req.url)
        let name = req.body.name || ''
        let res = false
        if (name) {
          res = await play(name)
        }
        res.json(res) // 发送响应
      } catch (error) {
        res.send(error) // 传递错误
      }
    }
 
