<template>
  <div class="nav">
    <router-link to="/" class="link">首页 </router-link>|
    <router-link to="/config">配置</router-link>
    <router-link to="/chat">对话</router-link>
    <router-link to="/eval">评估</router-link>
    <router-link to="/mine" class="link">我的</router-link>
    <router-link to="/login" class="link" id="login" v-if="!login">
      登录</router-link
    >
    <LogoutBtn v-if="login" />
  </div>
  <div id="container">
    <router-view />
  </div>
</template>

<script>
import LogoutBtn from "../src/components/LogoutBtn.vue";
import { useStore } from "vuex";
// 引入computed函数
import { computed } from "vue";
// 引入watchEffect函数
import { watchEffect } from "vue";
import { mapState, mapMutations } from "vuex";
import router from "./router";
// import { watch } from "vue";
// 在组件中引入mapGetters函数
// import { mapGetters } from 'vuex'
const store = useStore();
const state = computed(() => store.getters.getState); // 使用computed属性映射store中getters中的getState函数的值
export default {
  data() {
    return {
      login: false,
      store: useStore(),
    };
  },
  computed: {
    isLogin() {
      return this.$store.state.auth.isLogin;
    },
  },
  watch: {
    isLogin(newVal, oldVal) {
      console.log(newVal, oldVal);
      this.login = newVal;
      if (this.login === false) {
        router.push("/login");
      }
      // do something
    },
  },
  components: {
    LogoutBtn,
  },
  mounted() {
    this.$store.dispatch("checkLogin");
  },
};
// 使用watchEffect函数来监听state的变化，并将其赋值给login
// watchEffect(() => {
//   console.log(state.value);
//   login = state.value;
// }),
// store.dispatch("checkLogin");

// watch(
//   () => store.getters.getState, // 传入一个getter函数作为侦听源
//   (newValue, oldValue) => {
//     // 传入一个回调函数，接收新旧值作为参数
//     if (newValue) {
//       // 如果新值为真，表示登录成功，执行一些逻辑
//       login = newValue;
//       console.log("You are logged in.");
//     } else {
//       login = newValue;
//       // 如果新值为假，表示登出成功，执行一些逻辑
//       console.log("You are logged out.");
//     }
//   }
// );
</script>

<style scoped>
#login {
  position: absolute;
  right: 20px;
}
a {
  padding-left: 5px;
}
</style>
