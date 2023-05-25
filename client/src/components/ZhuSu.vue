<template>
  <div>
    <p>主诉</p>
    <textarea name="zhusu" id="zhusu" cols="30" rows="10"></textarea>
  </div>
</template>

<script>
export default {
  name: "ZhuSu",
};
</script>

<style scoped>
#zhusu {
  /* width: 200px; */
  height: 50px;
  border: 1px solid black;
  /* position: absolute; */
  left: 20px;
  resize: none;
  width: 170px;
}
</style>
