<template>
  <div class="nav">
    <router-link to="/" class="link">首页 </router-link>|
    <router-link to="/login" class="link"> 登录</router-link>
  </div>
  <div class="container">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style>
.link {
  margin: 5px;
}
</style>
