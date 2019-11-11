const app = getApp();
const loginUtil = require("../../utils/login.js");

Page({

  data: {
    isLogin: false
  },

  onLoad: function(options) {
    console.log("home: onLoad");

    const that = this;
    console.log(app.globalData.isLogin);

    if (typeof(app.globalData.isLogin) != "undefined") {
      //  app.js已返回结果
      console.log('home load，app已返回登录信息');
      this.setData({
        isLogin: app.globalData.isLogin
      });
      this.checkStatus();
    } else {
      //  app.js尚未返回结果
      console.log('home onLoad, app登录信息尚未返回');
      app.userInfoReadyCallback = res => {
        this.setData({
          isLogin: res
        });

        this.checkStatus();
      }
    }

  },

  checkStatus: function() {

    if (app.globalData.isLogin && this.data.isLogin) {
      //  检查session是否过期
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo'] && app.globalData.isLogin) {
            console.log('checkSess: 之前已授权，且已登录，检查session是否已经过期');

            loginUtil.checkSess().then(res => {
              console.log('是否过期', res);

              if (res) {
                // 已过期
                wx.showToast({
                  title: '登录已过期',
                  icon: 'none'
                });
                wx.navigateTo({
                  url: '../my/my',
                });
                this.data.isLogin = app.globalData.isLogin = false;
              } else {
                //  未过期
                this.data.isLogin = app.globalData.isLogin = true;
              }
            })
          }
        },
        complete: () => {
          wx.hideLoading();
        }
      })
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("home: onReachBottom");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})