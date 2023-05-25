<template>
  <div class="loginbox">
    <h1 id="loginheader">login</h1>
    <form action="" @submit.prevent="submit">
      <div class="form-item">
        <input type="text" placeholder="用户名" v-model="name" />
        <span v-if="usernameError">{{ usernameError }}</span>
      </div>
      <div class="form-item">
        <input type="password" placeholder="密码" v-model="password" />
        <span v-if="passwordError">{{ passwordError }}</span>
      </div>
      <button type="submit">登录</button>
      <a href="/register" style="color: white"
        >you don't have a accont?sign up</a
      >
    </form>
  </div>
</template>
<script setup>
import { useField } from "vee-validate";
import axios from "axios";
import qs from "qs";
import { useStore } from "vuex";
import router from "@/router";

const store = useStore();
const server = axios.create({
  baseURL: "/api",
});
var open = 0;
//表单验证
function checkname(value) {
  if (!value) {
    return "this field is required";
  }

  if (value.length < 3) {
    return "用户名至少三个字符";
  }

  return true;
}
function checkpassword(value) {
  if (!value) {
    return "this field is required";
  }

  if (value.length < 8) {
    return "密码至少8位";
  }

  return true;
}
const { value: name, errorMessage: usernameError } = useField(
  "name",
  checkname
);
const { value: password, errorMessage: passwordError } = useField(
  "password",
  checkpassword
);
//提交表单
function submit() {
  if (
    !usernameError.value &&
    !passwordError.value &&
    name.value &&
    password.value
  ) {
    server
      .post(
        "/login",
        qs.stringify({
          userName: name.value,
          password: password.value,
        })
      )
      .then((res) => {
        const { token } = res.data;
        console.log(res);
        storetoken(token);
        store.commit("login");
        router.push("/");
        // console.log(store);
        // const tokenStr = cookie.get("token");
        // console.log(document.cookie.split("; "));
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(name);
  }
}
function storetoken(token) {
  // 设置 cookie 的名称，值，过期时间和安全标志
  const cookieName = "token";
  const cookieValue = token;
  const cookieExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 分钟后过期
  const cookieSecure = true; // 只在 HTTPS 连接上发送

  // 创建 cookie 字符串
  const cookieString = `${cookieName}=${cookieValue};expires=${cookieExpire.toUTCString()};secure=${cookieSecure}`;

  // 将 cookie 字符串写入 document.cookie
  document.cookie = cookieString;
}
</script>
<style scoped>
.loginbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  height: 450px;
  background-color: darkslategray;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  box-shadow: 10px 10px 20px grey;
}
#loginheader {
  font-size: 45px;
  font-weight: 400;
  color: white;
}
form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 230px;
}
input {
  width: 150px;
  height: 40px;
  background-color: transparent;
  border: none;
  color: white;
  border-bottom: 2px solid white;
}
button {
  width: 150px;
  height: 40px;
  border-radius: 20px;
  border-color: 1px solid white;
  font-size: 12px;
}
input::placeholder {
  font-size: 12px;
  color: white;
}
.form-item {
  display: flex;
  flex-direction: column;
  width: 150px;
  height: 60px;
}
span {
  color: red;
}
</style>
