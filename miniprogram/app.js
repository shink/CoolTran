//app.js

const Bmob = require('utils/bmob.js');
const common = require("utils/common.js");
const loginUtil = require("utils/login.js");
Bmob.initialize("d3c65fe219129077c74c1a2dbccf89ab", "ccd8823cb404c9ca9c2969ded2a2712a");

App({
  onLaunch: function() {

    console.log("app: onLaunch");

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'shenkeenv-9dyqx',
        traceUser: true,
      })
    }

    try {
      wx.getSetting({
        success: res => {
          console.log(res);
          if (res.authSetting['scope.userInfo'] || wx.getStorageSync('openid')) {
            console.log('app: 之前已授权，或缓存中有openid，执行login获取code、session');
            wx.showLoading({
              title: '加载中',
            });

            loginUtil.doLogin().then(res => {
              console.log(res);
              this.globalData.isLogin = res.isLogin;
              wx.hideLoading();
            })
          }
        }
      })
    } catch (e) {
      console.log(e);
    }

  },

  globalData: {

    isLogin: false

  }

})