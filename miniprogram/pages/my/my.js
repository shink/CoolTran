const loginUtil = require("../../utils/login.js");

const app = getApp();

Page({

  data: {
    isCheck: false,
    isLogin: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: {},
    avatarUrl: '',
    nickName: ''
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });

    //  检查session
    loginUtil.checkSess().then(res => {
      if (res) {
        //  已过期
        app.globalData.isLogin = false;
      } else {
        //  未过期
        app.globalData.isLogin = true;

        this.setData({
          userInfo: wx.getStorageSync('userInfo'),
          avatarUrl: wx.getStorageSync('avatarUrl'),
          nickName: wx.getStorageSync('nickName')
        });
      }
      this.setData({
        isCheck: true,
        isLogin: app.globalData.isLogin
      });
      wx.hideLoading();
    }).catch(e => {
      console.log(e);
      this.setData({
        isCheck: false
      });
      wx.hideLoading();
    });

  },

  /**
   * 登录授权按钮
   */
  doGetUserInfo: function(e) {

    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      try {
        wx.showLoading({
          title: '登录中',
        });

        loginUtil.doLogin().then(res => {
          console.log(res);
          this.data.isLogin = app.globalData.isLogin = res.isLogin;
          this.onLoad();
          wx.hideLoading();
        });

      } catch (e) {
        console.log(e);
      }
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '提醒',
        content: '授权后才可上传或接收文件哦',
        showCancel: true,
        confirmText: '返回授权',
        confirmColor: '#39b54a',
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

})