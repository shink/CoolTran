const app = getApp();
const loginUtil = require("../../utils/login.js");

Page({

  data: {
    isLogin: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    avatarUrl: '',
    nickName: ''
  },

  onLoad: function(options) {
    console.log("my: onLoad");

    this.setData({
      isLogin: app.globalData.isLogin
    })

    if (this.data.isLogin) {
      //  已经登录过，则显示用户信息
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        avatarUrl: wx.getStorageSync('avatarUrl'),
        nickName: wx.getStorageSync('nickName')
      });
    } else if (this.data.canIUse) {
      //  尚未登录，但版本支持

    } else {
      // 用户版本不支持

    }
  },

  /**
   * 登录授权按钮
   */
  doGetUserInfo: function(e) {
    console.log('doGetUserInfo');
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      try {
        wx.showLoading({
          title: '登录中',
        });

        loginUtil.doLogin().then(res => {
          console.log(res);
          that.data.isLogin = app.globalData.isLogin = res.isLogin;
          that.onLoad();
          wx.hideLoading();
        });

      } catch (e) {
        console.log(e);
      }
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '授权后才可发送或接收文件哦',
        showCancel: false,
        confirmText: '返回授权',
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})