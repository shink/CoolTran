//app.js

const Bmob = require('utils/bmob.js');
const common = require("utils/common.js");
const loginUtil = require("utils/login.js");
const watchUtil = require('utils/watch.js');
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
          wx.showLoading({
            title: '加载中',
          });

          if (res.authSetting['scope.userInfo'] || wx.getStorageSync('openid')) {
            console.log('app: 之前已授权，或缓存中有openid，执行login获取code、session');

            loginUtil.doLogin().then(res => {
              console.log(res);
              this.globalData.isLogin = res.isLogin;

              //  此时home可能已经onLoad，所以加入回调函数，避免home错过登录信息
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res.isLogin);
              }
            })
          } else {
            //  尚未授权，且缓存中无openid
            console.log('尚未授权，且缓存中无openid');
            this.globalData.isLogin = false;
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(false);
            }
            wx.hideLoading();
          }
        },

        // complete: () => {
        //   wx.hideLoading();
        // }
      })
    } catch (e) {
      console.log(e);
      wx.hideLoading();
    }

  },

  globalData: {

  },

  setWatcher: function(page) {
    watchUtil.setWatcher(page);
  }

})