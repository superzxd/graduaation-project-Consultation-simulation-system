import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/beginpage/HomeView.vue";
// import Vue from "vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/config",
    name: "config",
    component: () =>
      import(
        /* webpackChunkName: "config" */ "../views/Userpage/ConfigView.vue"
      ),
    meta: { requiresAuth: true }, // 需要验证 token 的路由
  },
  {
    path: "/chat",
    name: "chat",
    component: () =>
      import(/* webpackChunkName: "char" */ "../views/Userpage/ChatView.vue"),
    meta: { requiresAuth: true }, // 需要验证 token 的路由
  },
  {
    path: "/eval",
    name: "eval",
    component: () =>
      import(/* webpackChunkName: "eval" */ "../views/Userpage/EvalView.vue"),
    meta: { requiresAuth: true }, // 需要验证 token 的路由
  },
  {
    path: "/mine",
    name: "mine",
    component: () =>
      import(/* webpackChunkName: "mine" */ "../views/Userpage/MineView.vue"),
    meta: { requiresAuth: true }, // 需要验证 token 的路由
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "test" */ "../views/beginpage/LoginView.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () =>
      import(
        /* webpackChunkName: "test" */ "../views/beginpage/RegisterView.vue"
      ),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行

  // 如果访问的是登录页面，直接放行
  if (to.path === "/login") return next();
  if (to.path === "/register") return next();

  // 获取 cookie 中的 token 值
  const tokenStr = document.cookie
    .split(";")
    .find((item) => item.includes("token="));
  // console.log(tokenStr);
  // 如果没有 token，强制跳转到登录页面
  if (!tokenStr) return next("/login");

  // 如果有 token，放行
  next();
});

export default router;
