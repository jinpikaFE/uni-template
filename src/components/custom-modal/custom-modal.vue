<template>
  <u-modal class="modal" :show="show" closeOnClickOverlay :showConfirmButton="false" @close="close" :negativeTop="100">
    <view class="modal-content" :style="modalContentStyle">
      <view class="title">
        <slot name="title" />
      </view>
      <view class="desc">
        <slot name="desc" />
      </view>
      <view class="flex mt-[80rpx] justify-center" v-if="!notFooter">
        <u-button
          v-if="!notCancel"
          color="#D9DDEC"
          custom-style="color: #5C6797;margin: 0;margin-right: 30rpx;width: 260rpx;height:80rpx"
          shape="circle"
          :text="cancelText || '取消'"
          @click="handleCancel"
        />
        <u-button
          color="#1349C9"
          shape="circle"
          custom-style="margin: 0;width: 260rpx;height:80rpx"
          :text="confirmText || '确定'"
          @click="handleConfirm"
          v-bind="confirmBtnProps"
          @getphonenumber="getphonenumber"
        />
      </view>
      <view class="footer">
        <slot name="footer" />
      </view>
    </view>
  </u-modal>
</template>

<script lang="ts" setup>
export type CustomModalRefProps = {
  open: () => void;
  close: () => void;
};
import { onMounted, ref } from 'vue';

const props = defineProps<{
  content?: string;
  cancelText?: string;
  confirmText?: string;
  confirmBtnProps?: any;
  onConfirm?: any;
  onCancel?: any;
  getphonenumber?: any;
  notFooter?: boolean;
  notCancel?: boolean;
  modalContentStyle?: any;
}>();

const show = ref(false);
const fullPath = ref('');

onMounted(() => {
  const pages = getCurrentPages();

  // 获取当前页面信息
  const currentPage = pages[pages.length - 1];

  fullPath.value = (currentPage as any)?.$page?.fullPath;
});

const open = () => {
  show.value = true;
};

const close = () => {
  show.value = false;
};

const handleConfirm = (e: any) => {
  if (props?.onConfirm) {
    props?.onConfirm(e);
  } else {
    close();
  }
};

const handleCancel = () => {
  if (props?.onCancel) {
    props?.onCancel();
  } else {
    close();
  }
};

defineExpose<CustomModalRefProps>({
  open,
  close,
});
</script>

<script lang="ts">
export default {
  options: {
    // 微信小程序中 options 选项
    styleIsolation: 'shared', // 启动样式隔离。当使用页面自定义组件，希望父组件影响子组件样式时可能需要配置。具体配置选项参见：微信小程序自定义组件的样式
  },
};
</script>

<style lang="scss" scoped>
.modal {
  ::v-deep {
    .u-line {
      display: none;
    }
    .u-popup__content,
    .u-modal {
      overflow: unset !important;
      background: transparent;
      border-bottom: unset;
      border-radius: 20rpx !important;
      width: 660rpx !important;
    }
    .u-modal__content {
      padding: 0 !important;
    }

    button {
      width: 240rpx;
      height: 80rpx;
      text {
        font-size: 36rpx !important;
      }
    }
  }
}

.modal-content {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 60rpx 50rpx 60rpx 50rpx;
  overflow: hidden;

  .title {
    font-size: 38rpx;
    font-weight: bold;
    text-align: center;
    color: #333333;
    line-height: 56rpx;
  }

  .desc {
    margin-top: 30rpx;
    font-size: 40rpx;
    font-weight: bold;
    text-align: center;
    color: #333333;
    line-height: 50rpx;
  }
}
</style>
