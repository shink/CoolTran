const app = getApp();
Page({
  data: {
    downloadList: []
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });

    const that = this;
    wx.cloud.callFunction({
      name: 'query-my-download',
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: res => {
        this.setData({
          downloadList: res.result.data
        });
      },
      fail: error => {
        console.log(error);
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    
    setTimeout(() => {
      this.onLoad();
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 1000);
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