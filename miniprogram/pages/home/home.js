const loginUtil = require("../../utils/login.js");
const fileUtil = require("../../utils/file.js");
const timeUtil = require('../../utils/util.js');

const app = getApp();

Page({

  data: {
    isLogin: false,
    modalName: ""
  },

  onLoad: function(options) {
    console.log("home: onLoad");

    if (typeof(app.globalData.isLogin) != "undefined") {
      //  app.js已返回结果
      console.log('home load，app已返回登录信息');
      this.setData({
        isLogin: app.globalData.isLogin
      });
      // this.checkStatus();
    } else {
      //  app.js尚未返回结果
      console.log('home onLoad, app登录信息尚未返回');
      app.userInfoReadyCallback = res => {
        this.setData({
          isLogin: res
        });
        // this.checkStatus();
        wx.hideLoading();
      }
    }

  },

  onHide: function() {
    this.hideModal();
  },

  /**
   * 显示模式窗口
   */
  showModal(e) {
    if (this.data.isLogin || app.globalData.isLogin) {
      this.setData({
        isLogin: app.globalData.isLogin,
        modalName: e.currentTarget.dataset.target
      });
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
    }
  },

  /**
   * 隐藏模式窗口
   */
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  /**
   * 上传图片
   */
  uploadImage: function() {
    const that = this;
    //  选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        //  调用upload进行文件上传
        that.upload(res.tempFiles[0].path, res.tempFiles[0].size);
      },
    })
  },

  /**
   * 上传视频
   */
  uploadVideo: function() {
    const that = this;
    //  选择视频
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: res => {
        //  调用upload进行文件上传
        that.upload(res.tempFilePath, res.size);
      }
    })
  },

  /**
   * 上传会话中的文件
   */
  uploadMessageFile: function() {
    const that = this;

    wx.chooseMessageFile({
      count: 1,
      success: res => {
        //  调用upload进行文件上传
        that.upload(res.tempFiles[0].path, res.tempFiles[0].size, res.tempFiles[0].name);
      }
    });
  },

  /**
   * 上传并添加记录到数据库
   * path：文件的临时路径
   * size：文件大小
   * name：文件名
   */
  upload: function(path, size, name = null) {
    wx.showLoading({
      title: '上传中',
    });

    // 文件类型
    var type = /\w+$/.exec(path)[0];
    //  上传时间
    var currentTime = new Date();
    var time = timeUtil.formatTime(currentTime);
    // 生成文件名(时间戳+源文件后缀名)
    var fileName = name ? name : currentTime.getTime() + '.' + type;
    //  转换size单位
    size = fileUtil.converSize(size);
    // 获取code
    fileUtil.generateCode().then(res => {
      var code = res;

      if (code === "") {
        //  获取code失败
        wx.hideLoading();
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
        this.hideModal();
      } else {
        //  上传
        wx.cloud.uploadFile({
          cloudPath: fileName,
          filePath: path, // 文件临时路径
          success: res => {
            let openid = wx.getStorageSync('openid');
            let fileID = res.fileID;

            let uploaderInfo = {
              avatarUrl: wx.getStorageSync('avatarUrl'),
              nickName: wx.getStorageSync('nickName')
            };

            let fileInfo = {
              fileName: fileName,
              type: type,
              size: size,
              time: time
            };

            //  将上传文件记录存储到数据库
            wx.cloud.callFunction({
              name: 'file-upload',
              data: {
                openid: openid,
                fileID: fileID,
                code: code,
                uploaderInfo: uploaderInfo,
                fileInfo: fileInfo
              },
              success: res => {
                wx.hideLoading();
                wx.showToast({
                  title: '上传成功'
                });
              },
              fail: error => {
                wx.hideLoading();
                wx.showToast({
                  title: '上传失败',
                  icon: 'none'
                });
              },
              complete: () => {
                this.hideModal();
              }
            });
          }
        })
      }
    });

  },

  /**
   * 取件码取文件，跳转到detail
   */
  getFileByCode: function(e) {
    let source = e.target.dataset.source;
    // let code = '7yeh';
    // let code = 'vA5z';
    let code = 'xUt7';
    // let code = 'klih';
    wx.navigateTo({
      url: '/pages/detail/detail?source=' + source + '&code=' + code
    })
  },


  // 检查用户登录状态（在home页面好像没用，先放这里，写别的页面的时候再用）
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