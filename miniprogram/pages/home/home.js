const app = getApp();
const loginUtil = require("../../utils/login.js");

Page({

  data: {

  },


  onLoad: function(options) {
    console.log("home: onLoad");

    //  检查session是否过期
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] && app.globalData.isLogin) {
          console.log('checkSess: 之前已授权，且已登录，检查session是否已经过期');

          loginUtil.checkSess().then(res => {
            console.log(res);

            if (res) {
              // 已过期
              wx.showToast({
                title: '登录已过期',
                icon: 'none'
              });
              wx.navigateTo({
                url: '../my/my',
              });
              app.globalData.isLogin = false;
            }
          })
        }
      }
    })

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