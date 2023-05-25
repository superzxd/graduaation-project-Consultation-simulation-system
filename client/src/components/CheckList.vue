<template>
  <div id="selectbox">
    <p>检查清单</p>
    <select v-for="i in num" :key="i" :class="['list', i]">
      <option value="StoolRoutine">大便常规</option>
      <option value="UrineRoutine">小便常规</option>
    </select>
    <button id="addcheck" @click="addcheck" v-if="num < alllist">添加</button>
  </div>
</template>

<script>
export default {
  name: "CheckList",
  data() {
    return {
      num: 1,
      alllist: 2,
    };
  },
  methods: {
    addcheck() {
      this.num += 1;
    },
  },
};
</script>

<style>
#selectbox {
  width: 200px;
  height: 200px;
  /* display: flex; */
  left: 20px;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}
.list {
  margin: 5px;
}
</style>
