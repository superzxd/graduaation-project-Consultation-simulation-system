/*·eslint-disable·*/
<template>
  <div class="chat">
    <div class="check-history-box" @click="showbox">
      <div class="close" id="close-btn"></div>
      <div class="dialog">
        <div class="messages">
          <div
            v-for="msg in messages"
            :key="msg.key"
            :class="['box', msg.sender]"
          >
            <div :class="['text-box', msg.sender]">
              <div :class="['time', msg.sender]">{{ msg.key }}</div>
              <div :class="['text', msg.sender]">{{ msg.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div id="dialogarea">
        <SpeakingPart @send-message="receive" v-if="step === 1" />
        <div id="btnarea">
          <button class="btn end" v-if="step === 1" @click="endquery">
            问诊结束
          </button>
          <button class="btn save" v-if="step === 1" @click="saverecord">
            保存记录
          </button>
        </div>
      </div>
      <div id="checkresultbox">
        <ZhuSu ref="zhusu" v-if="step === 1" />
        <CheckList v-if="step === 1" />
      </div>
      <button class="btn start" v-if="step === 0" @click="startquery">
        开始问诊
      </button>
    </div>
  </div>
</template>

<script>
import SpeakingPart from "../../components/SpeakingPart.vue";
import ZhuSu from "../../components/ZhuSu.vue";
import CheckList from "../../components/CheckList.vue";
import axios from "axios";
import qs from "qs";
const server = axios.create({
  baseURL: "/api",
});
var flag = 0;
export default {
  data() {
    return {
      input: "",
      messages: [],
      historymes: [],
      sender: "me",
      startTime: "",
      step: 0,
    };
  },
  methods: {
    toggleSender() {
      this.sender = this.sender === "me" ? "you" : "me";
    },
    showbox() {
      var dialog = document.querySelector(".dialog");
      var messages = document.querySelector(".messages");
      var close = document.querySelector(".close");
      // console.log(flag);
      if (flag === 0) {
        dialog.className += " dialog-show";
        dialog.style.display = "flex";
        messages.style.display = "block";
        close.style.display = "inline-block";
        flag = 1;
        this.$nextTick(() => {
          var messages = document.querySelector(".messages");
          if (messages.lastElementChild) {
            messages.lastElementChild.style.display = "block";
            messages.lastElementChild.scrollIntoView();
          }
        });
      } else {
        // dialog.className.replace(" dialog-show", "");
        console.log(dialog.className);
        // dialog.style.display = " none";
        dialog.classList.remove("dialog-show");
        messages.style.display = "none";
        close.style.display = "none";
        flag = 0;
      }
    },
    receive(chatgpt, Uservoice) {
      if (chatgpt) {
        this.input = chatgpt;
        if (this.input) {
          this.messages.push({
            key: Date.now(),
            text: this.input,
            sender: this.sender,
          });
          this.historymes.push({
            message: this.input,
            sender: this.sender,
          });
          // var p = document.getElementById(this.id);
          this.input = "";
          this.toggleSender();
          this.$nextTick(() => {
            var messages = document.querySelector(".messages");
            messages.lastElementChild.style.display = "block";
            messages.lastElementChild.scrollIntoView();
          });
        }
      }
      if (Uservoice) {
        this.input = Uservoice;
        if (this.input) {
          this.messages.push({
            key: Date.now(),
            text: this.input,
            sender: this.sender,
          });
          this.historymes.push({
            text: this.input,
            sender: this.sender,
          });
          // var p = document.getElementById(this.id);
          this.input = "";
          this.toggleSender();
          this.$nextTick(() => {
            var messages = document.querySelector(".messages");
            messages.lastElementChild.style.display = "block";
            messages.lastElementChild.scrollIntoView();
          });
        }
      }
    },
    startquery() {
      this.step = 1;
      this.startTime = this.getTime() + "";
      console.log(this.startTime);
    },
    endquery() {
      this.isStart = false;
      this.step = 0;
      this.messages = [];
      this.historymes = [];
    },
    getTime() {
      let now = new Date();
      var year = now.getFullYear();
      var mouth = now.getMonth() + 1;
      var day = now.getDate();
      var hours = now.getHours();
      var mins = now.getMinutes();
      var seconds = now.getSeconds();
      var nowTime =
        year +
        ":" +
        mouth +
        ":" +
        day +
        " " +
        hours +
        ":" +
        mins +
        ":" +
        seconds;
      return nowTime;
    },
    saverecord() {
      let isright = this.checkAll();
      const e = true;
      if (isright) {
        // alert("ok");
        server
          .post(
            "/savemessages",
            qs.stringify({
              startTime: this.startTime, //this.startTime
              messages: this.historymes, //this.historymes
              endTime: this.getTime(), //this.getTime()
            })
          )
          .then((res) => {
            alert(res);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    checkAll() {
      let _zhusu = this.$refs.zhusu.$el.querySelector("textarea");
      console.log(this.historymes.length);
      if (this.historymes.length === 0) {
        alert("问诊记录是空的");
        return false;
      }
      if (!_zhusu.value) {
        alert("没有填写主诉");
        return false;
      }
      return true;
    },
  },

  components: {
    SpeakingPart,
    ZhuSu,
    CheckList,
  },
};
</script>

<style scoped>
@keyframes pop-up {
  0% {
    left: 0;
    top: 0;
    transform: scale(0.5);
  }
  100% {
    left: 50%;
    top: 50%;
    transform: scale(1);
  }
}

/* .messages::-webkit-scrollbar {
  width: 10px;
  border-radius: 10px;
} */
/* 滑条样式 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  z-index: 0;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 5px;
}

::-webkit-scrollbar-track {
  background: #eee;
  border-radius: 10px;
  z-index: 0px;
}
/* 消息记录盒子 */
.check-history-box {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  /* background-color: blueviolet; */
  background-color: white;
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 99;
  outline: 5px solid #4e6c71;
}
.dialog {
  position: fixed;
  transition: width 2s, height 2s;
  width: 30px;
  height: 30px;
  right: 20px;
  /* margin-bottom: 100px; */
  top: 100px;
  /* border: 1px solid #0a0a0a; */
  border-radius: 10px;
  flex-direction: column;
  z-index: 10;
  outline: 5px solid blueviolet;
  -webkit-box-shadow: -1px -1px 24px #000000;
  -moz-box-shadow: -1px -1px 24px #000000;
  box-shadow: -1px -1px 24px #000000;
  /* outline: 5px solid blueviolet; */
}
.dialog-show {
  transition: width 1s, height 1s;
  position: fixed;
  width: 450px;
  height: 545px;
  right: 20px;
  top: 100px;
  /* margin-bottom: 100px; */
  /* border: 1px solid #0a0a0a; */
  border-radius: 10px;
  flex-direction: column;
  outline: 5px solid blueviolet;
  z-index: 10;
  -webkit-box-shadow: -1px -1px 24px #000000;
  -moz-box-shadow: -1px -1px 24px #000000;
  box-shadow: -1px -1px 24px #000000;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: none;
  /* background-color: #2196f3; */
  z-index: 11;
}
.box {
  display: inherit;
}
/* 你 */
.text-box.me {
  /* border: 1px solid black; */
  margin-top: 0px;
  width: fit-content;
  margin-left: auto;
  margin-right: 40px;
  display: inherit;
  transition: width 1s;
}
.time.me {
  /* border: 1px solid black; */
  width: fit-content;
  margin-left: auto;
  display: inherit;
}
.text.me {
  /* border: 1px solid black; */
  width: 100%;
  /* background-color: #2196f3; */
  margin-left: auto;
  max-width: 300px;
  padding: 10px;
  word-wrap: break-word; /* IE 5.5-7 */
  white-space: pre-wrap;
  background-color: blueviolet;
  border-radius: 10px;
  display: inherit;
}
/* 电脑 */
.text-box.you {
  /* border: 1px solid black; */
  margin-top: 0px;
  width: fit-content;
  margin-right: auto;
  margin-left: 40px;
  display: inherit;
}
.time.you {
  /* border: 1px solid black; */
  width: fit-content;
  margin-right: auto;
  display: inherit;
}
.text.you {
  /* border: 1px solid black; */
  width: 100%;
  /* background-color: #2196f3; */
  margin-right: auto;
  max-width: 300px;
  padding: 10px;
  word-wrap: break-word; /* IE 5.5-7 */
  white-space: pre-wrap;
  background-color: white;
  border-radius: 10px;
  animation-name: pop-up;
  animation-duration: 2s;
  animation-timing-function: ease-out;
  display: inherit;
}
/* .... */
.input {
  display: flex;
  position: fixed;
  bottom: 0px;
}
input {
  flex: 1;
  border: none;
  padding: 10px;
}
button {
  width: 80px;
  border: none;
  background-color: #2196f3;
  color: white;
}
.btn {
  width: 100px;
  height: 40px;
  margin: 20px;
}
/* .btn.end {
  position: relative;
  bottom: 40px;
  left: 300px;
} */
#btnarea {
  display: flex;
  flex-direction: row;
  justify-content: center;
  bottom: 50px;
  position: relative;
  /* justify-content: space-around; */
}
#checkresultbox {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 20px;
  top: 100px;
}
#dialogarea {
  display: flex;
  flex-direction: column;
}
.container {
  display: flex;
  flex-direction: row;
}
</style>
