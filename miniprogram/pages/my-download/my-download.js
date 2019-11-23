const fileUtil = require("../../utils/file.js");
const loginUtil = require("../../utils/login.js");

const app = getApp();

Page({
  data: {
    isCheck: false,
    isEmpty: false,
    downloadList: []
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });

    //  检查session
    loginUtil.checkSess().then(res => {
      this.setData({
        isCheck: true
      });
      if (res) {
        //  已过期
        app.globalData.isLogin = false;
      } else {
        //  未过期
        app.globalData.isLogin = true;

        //  查询我的下载记录
        fileUtil.queryMyFile('query-my-download').then(res => {
          if (res[0]) {
            //  成功
            this.setData({
              downloadList: res[1]
            });
            if (res[1].length === 0) {
              this.setData({
                isEmpty: true
              });
            }
            wx.hideLoading();
          } else {
            //  失败
            wx.hideLoading();
            wx.showToast({
              title: '获取信息失败',
              icon: 'none'
            })
          }
        });
      }

    }).catch(e => {
      console.log(e);
      this.setData({
        isCheck: false
      });
      wx.hideLoading();
    });
  },

  /**
   * 删除上传记录和云存储文件
   */
  deleteDownload: function(e) {
    wx.showLoading({
      title: '删除中',
    });

    let fileID = e.currentTarget.dataset.target;
    let index = e.currentTarget.dataset.index;

    fileUtil.deleteDB('delete-download', fileID).then(res => {

      if (res) {
        let list = this.data.downloadList;
        list.splice(index, 1);
        this.setData({
          downloadList: list
        });
        if (list.length === 0) {
          this.setData({
            isEmpty: true
          });
        }
        wx.hideLoading();
        wx.showToast({
          title: '删除成功',
        });
      } else {
        wx.hideLoading();
        wx.showToast({
          title: '删除失败',
        });
      }
    });
  },

  /**
   * 预览
   */
  preview: function(e) {
    let fileID = e.currentTarget.dataset.target;
    let type = e.currentTarget.dataset.type;
    let typeNum = fileUtil.judgeType(type);

    if (typeNum === 1) {
      //  是图片类型
      wx.previewImage({
        urls: [fileID],
        success: res => {},
        fail: error => {
          console.log(error);
        }
      });
    } else if (typeNum === 3) {
      //  是文档类型
      wx.showLoading({
        title: '加载中',
      });

      wx.cloud.downloadFile({
        fileID: fileID,
        success: res => {
          console.log(res);
          let filePath = res.tempFilePath;

          wx.openDocument({
            filePath: filePath,
            success: function(res) {
              console.log('打开文档成功');
              wx.hideLoading();
            }
          })
        }
      })
    } else {
      //  是其他类型
      wx.showToast({
        title: '该文件类型不支持预览',
        icon: 'none'
      });
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    });

    setTimeout(() => {
      fileUtil.queryMyFile('query-my-download').then(res => {
        if (res[0]) {
          //  成功
          this.setData({
            downloadList: res[1]
          });
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        } else {
          //  失败
          wx.hideLoading();
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
          wx.showToast({
            title: '获取信息失败',
            icon: 'none'
          })
        }
      });
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
 
})