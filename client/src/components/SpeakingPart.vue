<template>
  <section>
    <div class="Speakingpart">
      <div class="dialog-platform"></div>
      <div class="mes-box patient">
        <div class="mes patient">...</div>
      </div>
      <div class="mes-box user">
        <div class="mes user"></div>
      </div>
      <button @click="start" class="start-btn" src="/">
        <img src="../assets/voice.png" alt="" />
      </button>
    </div>
  </section>
</template>
<script>
import Voice from "../assets/js/voice";
import axios from "axios";
import qs from "qs";
const Buffer = require("buffer").Buffer;
const server = axios.create({
  baseURL: "/api",
});
// import "../assets/js/transcode.worker";
var flag = 0;
// let Uservoice = "";
let IatRecorder = Voice();
export default {
  name: "SpeakingPart",
  data() {
    return {
      Uservoice: "",
      chatgpt: "",
      Voice: null,
    };
  },
  methods: {
    start() {
      var startbtn = document.querySelector(".start-btn");
      var Usermes = document.querySelector(".mes.user");
      var chatgptmes = document.querySelector(".mes.patient");
      let times = null;
      if (this.Voice === null) {
        this.Voice = new IatRecorder({
          appId: "",
          apiSecret: "",
          apiKey: "",
          // 注：要获取以上3个参数，请到迅飞开放平台：https://www.xfyun.cn/services/voicedictation 【注：这是我的迅飞语音听写（流式版）每天服务量500（也就是调500次），如果你需求里大请购买服务量：https://www.xfyun.cn/services/voicedictation?target=price】

          onWillStatusChange: function () {
            //可以在这里进行页面中一些交互逻辑处理：注：倒计时（语音听写只有60s）,录音的动画，按钮交互等！
            // fixedBox.style.display = "block";
          },
          onTextChange: function (text) {
            //监听识别结果的变化
            // this.Uservoice = text;
            Usermes.innerHTML = text;
            // console.log(this.Uservoice);
            // 3秒钟内没有说话，就自动关闭
            if (text) {
              clearTimeout(times);
              times = setTimeout(() => {
                this.stop(); // voice.stop();
                startbtn.classList.remove("ing");
                // fixedBox.style.display = "none";
              }, 3000);
            }
          },
        });
      }
      if (flag === 0) {
        startbtn.className += " ing";
        this.Voice.start();
        flag = 1;
      } else {
        this.Uservoice = Usermes.innerHTML;
        this.$emit("send-message", this.Uservoice);
        startbtn.classList.remove("ing");
        this.Voice.stop();
        // console.log(this.Uservoice);
        // this.$emit("send-message", this.Uservoice);
        if (this.Uservoice) {
          server
            .post(
              "/chatgpt",
              qs.stringify({
                question: this.Uservoice,
              })
            )
            .then((res) => {
              console.log(res.data);
              let { data, mp3 } = res.data;
              // this.chatgpt = res.data;
              this.chatgpt = data;
              chatgptmes.innerHTML = data;
              this.$emit("send-message", this.chatgpt);
              // 前端接收Base64编码的字符串
              let blob = new Blob([Buffer.from(mp3, "base64")]);
              let url = URL.createObjectURL(blob);
              let audio = new Audio(url);
              audio.play();
            })
            .catch((err) => {
              console.log(err);
            });
        }
        flag = 0;
      }
    },
  },
};
</script>
<style>
.Speakingpart {
  width: 700px;
  height: 500px;
  /* position: fixed; */
  position: relative;
  bottom: 50px;
  /* top: 100px;
  left: 320px; */
  display: inline-block;
}
.dialog-platform {
  width: 750px;
  height: 500px;
  position: absolute;
  /* top: 100px; */
  /* left: 320px; */
  border-radius: 5% 5% 11% 5%;
  background-color: darkgrey;
  opacity: 0.3;
}

.mes-box {
  position: absolute;
  width: 300px;
  height: 200px;
  left: 30%;
  /* background-color: dimgray; */
  /* opacity: 0.3; */
  /* border: 1px solid black; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* opacity: 1; */
}
.mes-box.patient {
  top: 14px;
}
.mes-box.user {
  bottom: 80px;
}
.mes {
  display: inline-block;
  height: fit-content;
  max-width: 250px;
}
.mes.patient {
  position: absolute;
}
.mes.user {
  position: absolute;
}
</style>
