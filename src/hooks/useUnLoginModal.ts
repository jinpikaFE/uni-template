export function useUnLoginModal() {
  const showModal = () => {
    uni.showModal({
      title: '未登录！是否前往登录',
      success: function (res: any) {
        if (res.confirm) {
          uni.reLaunch({
            url: '/pages/login/index',
          });
        } else if (res.cancel) {
          uni.switchTab({
            url: 'pages/dynamic/index',
          });
        }
      },
    });
  };
  return {
    showModal,
  };
}
