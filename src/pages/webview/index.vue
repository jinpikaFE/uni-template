<template>
  <div class="relative w-full bg-white wrapper" style="height: 100vh;">
    <web-view :src="url" />
  </div>
</template>
<script lang="ts" setup>
import { onLoad } from '@dcloudio/uni-app';
import { ref } from 'vue';

const url = ref('');

// 下一个页面的onLoad函数可得到传递的参数
onLoad(params => {
  url.value = decodeURIComponent(params?.url);
});
</script>
<style lang=""></style>
