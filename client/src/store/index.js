// 创建 store.js 文件
import { createStore } from "vuex";

// 定义登录状态模块
const authModule = {
  // 定义状态
  state: () => ({
    isLogin: false,
    // 当前登录状态
  }),
  // 定义 mutations
  mutations: {
    // 设置登录状态为 true
    login(state) {
      state.isLogin = true;
      console.log("1");
    }, // 设置登录状态为 false
    logout(state) {
      state.isLogin = false;
      console.log("2");
    },
  },
  // 定义 actions
  actions: {
    checkLogin({ commit }) {
      const token = document.cookie.match(/token=(\w+)/)?.[1];
      if (token) {
        commit("login");
      } else {
        commit("logout");
      }
    },
  },
  getters: {
    getState: (state) => {
      return state.isLogin;
    },
  },
};

// 创建 store 实例
const store = createStore({ modules: { auth: authModule } });

export default store;
