<template>
  <div class="parent">
    <HistoryList :records="records"></HistoryList>
  </div>
</template>

<script>
import HistoryList from "../../components/HistoryBox.vue";
import axios from "axios";
import qs from "qs";

const server = axios.create({
  baseURL: "/api",
});
export default {
  components: {
    HistoryList,
  },
  data() {
    return {
      records: [], // 这里是你从后端获取的数据
    };
  },
  mounted() {
    // 这里是你调用后端接口的逻辑，把数据赋值给records
    server
      .post("/getmessages")
      .then((res) => {
        console.log(res.data.length);
        let num = res.data.length;
        for (var i = 0; i < num; i++) {
          this.records.push(res.data[i]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(name);
  },
};
</script>
