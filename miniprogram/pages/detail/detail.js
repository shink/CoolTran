const timeUtil = require('../../utils/util.js');
const fileUtil = require('../../utils/file.js');

const app = getApp();

Page({

  data: {
    uploaderInfo: {},
    fileInfo: {},
    fileID: '',
    typeNum: 0,
    download_button_name: ''
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });
    let code = options.code;

    wx.cloud.callFunction({
      name: 'query-code',
      data: {
        code: code
      },
      success: res => {
        let data = res.result.data[0];
        let buttonName = ['获取下载链接', '保存图片到本地', '保存视频到本地'];
        let typeNum = fileUtil.judgeType(data.fileInfo.type);

        this.setData({
          uploaderInfo: data.uploaderInfo,
          fileInfo: data.fileInfo,
          fileID: data.fileID,
          typeNum: typeNum,
          download_button_name: buttonName[typeNum]
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
   * 点击下载
   */
  download: function() {

    if (!app.globalData.isLogin) {
      //  未登录
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '下载中',
      });

      if (this.data.typeNum === 0) {
        //  生成下载链接
        fileUtil.generateUrl(this.data.fileID).then(res => {
          console.log(res);
          this.insertToDownload(res);
        });
      } else {
        wx.cloud.downloadFile({
          fileID: this.data.fileID,
          success: res => {
            let path = res.tempFilePath;

            if (this.data.typeNum === 1) {
              //  保存图片到本地
              fileUtil.saveImage(path).then(res => {
                this.insertToDownload(res);
              });
            } else if (this.data.typeNum === 2) {
              //  保存视频到本地
              fileUtil.saveVideo(path).then(res => {
                this.insertToDownload(res);
              });
            }
          },
          fail: error => {
            console.log(error);
            wx.hideLoading();
            wx.showToast({
              title: '下载失败',
              icon: 'none'
            });
          }
        });
      }
    }
  },

  /**
   * 写入download表
   */
  insertToDownload: function(result) {
    if (!result || result === '') {
      //  保存失败
      wx.hideLoading();
      wx.showToast({
        title: '下载失败',
        icon: 'none'
      });
    } else {
      //  保存成功

      let openid = wx.getStorageSync('openid');
      let fileID = this.data.fileID;
      //  下载时间
      let time = timeUtil.formatTime(new Date());

      let downloaderInfo = {
        avatarUrl: wx.getStorageSync('avatarUrl'),
        nickName: wx.getStorageSync('nickName')
      };

      let fileInfo = {};
      fileInfo.fileName = this.data.fileInfo.fileName;
      fileInfo.type = this.data.fileInfo.type;
      fileInfo.size = this.data.fileInfo.size;
      fileInfo.time = time;

      // 将上传文件记录存储到数据库
      wx.cloud.callFunction({
        name: 'file-download',
        data: {
          openid: openid,
          fileID: fileID,
          downloaderInfo: downloaderInfo,
          fileInfo: fileInfo
        },
        success: res => {
          wx.hideLoading();
          wx.showToast({
            title: '下载成功'
          });

          //  再次判断文件类型是否是其他，若是其他则弹出显示框，显示临时URL
          if (this.data.typeNum === 0) {
            this.showTempURL(result);
          }
        },
        fail: error => {
          wx.hideLoading();
          wx.showToast({
            title: '下载失败',
            icon: 'none'
          });
        }
      });
    }
  },

  /**
   * 显示临时URL
   */
  showTempURL: function(url) {
    wx.showToast({
      title: url,
      icon: 'none'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})