<template>
  <button @click="logout" id="logout">登出</button>
</template>
<script>
import axios from "axios";
// import { useStore } from "vuex";
// import { mapState, mapGetters } from "vuex";
// const store = useStore();
const server = axios.create({
  baseURL: "/api",
});
export default {
  name: "LogoutBtn",
  data() {
    return {
      isLogin: false,
    };
  },
  methods: {
    logout() {
      server
        .post("/logout")
        .then((res) => {
          console.log(res);
          this.$store.commit("logout");
          // console.log(this.$store);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style>
#logout {
  width: 70px;
  height: 45px;
  position: absolute;
  right: 10px;
  border-radius: 5px;
  color: white;
  background-color: darkgreen;
}
</style>
