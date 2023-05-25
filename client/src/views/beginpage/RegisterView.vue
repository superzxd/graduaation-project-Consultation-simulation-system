<template>
  <div class="loginbox">
    <h1 id="loginheader">sigup</h1>
    <form action="" @submit.prevent="submit">
      <div class="form-item">
        <input type="text" placeholder="用户名" v-model="name" />
        <span v-if="usernameError">{{ usernameError }}</span>
      </div>
      <div class="form-item">
        <input type="password" placeholder="密码" v-model="password" />
        <span v-if="passwordError">{{ passwordError }}</span>
      </div>
      <div class="form-item">
        <input
          type="password"
          placeholder="再次输入密码"
          v-model="passwordagain"
        />
        <span v-if="passwordError">{{ passwordagainError }}</span>
      </div>
      <button type="submit">注册</button>
    </form>
  </div>
</template>
<script setup>
import { useField } from "vee-validate";
import axios from "axios";
import qs from "qs";
import router from "@/router";

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
const { value: passwordagain, errorMessage: passwordagainError } = useField(
  "passwardagain",
  checkpassword
);
//提交表单
function submit() {
  if (
    !usernameError.value &&
    !passwordError.value &&
    name.value &&
    password.value &&
    password.value === passwordagain.value
  ) {
    server
      .post(
        "/register",
        qs.stringify({
          userName: name.value,
          password: password.value,
        })
      )
      .then((res) => {
        console.log(res);
        router.push("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (password.value !== passwordagain.value) {
    alert("密码不一致");
  }
}
</script>

<style scoped>
.loginbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
  height: 450px;
  background-color: cadetblue;
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
