const express = require('express')
const router = express.Router()
const userController = require('../modelcontrollers/Usercontrollers')
const voiceController = require('../modelcontrollers/VoiceController')
const chatgptVoice = require('../modelcontrollers/chatgptvoice')
const messagesController = require('../modelcontrollers/messagesController')


router.post('/chatgpt',chatgptVoice.chatgpt)
router.post('/register',userController.createUser)
router.get('/homepage',userController.loginCheck)
router.post('/login',userController.login)
router.post('/logout',userController.logOut)
router.post('/checklogin',userController.loginCheck)
router.post('/voice',voiceController.Voice)
router.post('/savemessages',messagesController.savemessages)
router.post('/getmessages',messagesController.getMessages)

    module.exports = router;