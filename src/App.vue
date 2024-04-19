<script setup lang="ts">
import { useAppStore } from '@/stores/modules/app';
import {  onLaunch } from '@dcloudio/uni-app';

const commonStore = useAppStore();

onLaunch(async () => {
  commonStore.initSystemInfo();
});
</script>
<style>
page {
  overflow-y: auto !important;
}

::-webkit-scrollbar {
  width: 0; /* 隐藏滚动条 */
}
/* @import '@/static/iconfont/iconfont.css'; */
</style>
