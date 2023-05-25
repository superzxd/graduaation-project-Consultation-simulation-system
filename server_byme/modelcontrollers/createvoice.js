const CryptoJS = require('crypto-js')
const WebSocket = require('ws')
const fs = require('fs')
const sound = require("sound-play");
const log = require('log4node')
let isPlay = false
let cb = null
// 系统配置 
const config = {
    // 请求地址
    hostUrl: "wss://tts-api.xfyun.cn/v2/tts",
    host: "tts-api.xfyun.cn",
    //在控制台-我的应用-在线语音合成（流式版）获取
    appid: "e5f01dac",
    //在控制台-我的应用-在线语音合成（流式版）获取
    apiSecret: "ZDQ1ZWQyN2NkZWM5NjVjOTBiYjAzMTBi",
    //在控制台-我的应用-在线语音合成（流式版）获取
    apiKey: "cfbc09f4b9537baed63639efd5a297b4",
    text: `你好，欢迎使用讯飞语音合成。`,
    uri: "/v2/tts",
}

// 获取当前时间 RFC1123格式
let date = (new Date().toUTCString())
// 设置当前临时状态为初始化

let wssUrl = config.hostUrl + "?authorization=" + getAuthStr(date) + "&date=" + date + "&host=" + config.host
let ws = null


// 鉴权签名
function getAuthStr(date) {
    let signatureOrigin = `host: ${config.host}\ndate: ${date}\nGET ${config.uri} HTTP/1.1`
    let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
    let signature = CryptoJS.enc.Base64.stringify(signatureSha)
    let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`
    let authStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(authorizationOrigin))
    return authStr
}

// 传输数据
function send() {
    let frame = {
        // 填充common
        "common": {
            "app_id": config.appid
        },
        // 填充business
        "business": {
            "aue": "lame",
            "sfl": 1,
            "auf": "audio/L16;rate=16000",
            "vcn": "xiaoyan",
            "tte": "UTF8",
            // speed: 30
        },
        // 填充data
        "data": {
            "text": Buffer.from(config.text).toString('base64'),
            "status": 2
        }
    }
    ws.send(JSON.stringify(frame))
}

// 保存文件
function save(data) {
    fs.writeFile('./test.mp3', data, { flag: 'a' }, (err) => {
        if (err) {
            log.error('save error: ' + err)
            return
        }

        log.info('文件保存成功')
    })
}

// data为false 时，表示播放结束
function setRes(data) {
    isPlay = data
    cb && cb(true)
}

exports.play = (text) => {
    // isPlay = true
    if (!isPlay) {
        config.text = `''${text}''`
        ws = new WebSocket(wssUrl)

        // 连接建立完毕，读取数据进行识别
        ws.on('open', () => {
            log.info("websocket connect!")
            send()
            // 如果之前保存过音频文件，删除之
            if (fs.existsSync('./test.mp3')) {
                fs.unlink('./test.mp3', (err) => {
                    if (err) {
                        log.error('remove error: ' + err)
                    }
                })
            }
        })

        // 得到结果后进行处理，仅供参考，具体业务具体对待
        ws.on('message', (data, err) => {
            if (err) {
                log.error('message error: ' + err)
                ws.close()
                setRes(false)
                return
            }
            let res = JSON.parse(data)
            if (res.code != 0) {
                log.error(`${res.code}: ${res.message}`)
                ws.close()
                setRes(false)
                return
            }
            let audio = res.data.audio
            let audioBuf = Buffer.from(audio, 'base64')

            save(audioBuf)

            if (res.code == 0 && res.data.status == 2) {
                ws.close()
                sound.play("test.mp3").then((response) => {
                    log.info("play done")
                    setRes(false)
                }).catch((err) => {
                    log.info("play err", err)
                    setRes(false)
                })
            }
        })

        // 资源释放
        ws.on('close', () => {
            log.info('connect close!')
        })

        // 连接错误
        ws.on('error', (err) => {
            log.error("websocket connect err: " + err)
            setRes(false)
        })
    }

    return new Promise((resolve, reject) => {
        isPlay ? resolve(true) : (cb = resolve)
    })
}