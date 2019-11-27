const timeUtil = require('../../utils/util.js');
const fileUtil = require('../../utils/file.js');
const loginUtil = require('../../utils/login.js');

const app = getApp();

Page({

  data: {
    isCheck: false, //  检查session是否过期，session在整个生命周期中状态一致，检查一遍后无需多次检查
    data: {},
    uploaderInfo: {},
    fileInfo: {},
    fileID: '',
    typeNum: 0,
    download_button_name: '',
    operate_name: ''
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
      }

      let data = JSON.parse(options.data);

      let buttonName = ['获取下载链接', '保存图片到本地', '保存视频到本地', '获取下载链接'];
      let operate_name_array = ['获取', '保存', '保存', '获取'];
      let typeNum = fileUtil.judgeType(data.fileInfo.type);

      this.setData({
        data: data,
        uploaderInfo: data.uploaderInfo,
        fileInfo: data.fileInfo,
        fileID: data.fileID,
        typeNum: typeNum,
        download_button_name: buttonName[typeNum] + ' (' + data.fileInfo.size + ')',
        operate_name: operate_name_array[typeNum]
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
   * 预览
   */
  preview: function(e) {

    if (this.data.typeNum === 1) {
      //  是图片类型
      wx.showLoading({
        title: '加载中',
      });

      wx.previewImage({
        urls: [this.data.fileID],
        success: res => {},
        fail: error => {
          console.log(error);
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    } else if (this.data.typeNum === 3) {
      //  是文档类型
      wx.showLoading({
        title: '加载中',
      });

      wx.cloud.downloadFile({
        fileID: this.data.fileID,
        success: res => {
          let filePath = res.tempFilePath;

          wx.openDocument({
            filePath: filePath,
            success: function(res) {
              console.log('打开文档成功');
            },
            complete: () => {
              wx.hideLoading();
            }
          })
        }
      })
    }

  },

  /**
   * 点击下载
   */
  download: function() {

    if (this.data.isCheck && app.globalData.isLogin) {
      wx.showLoading({
        title: this.data.operate_name + '中',
      });

      if (this.data.typeNum === 0 || this.data.typeNum === 3) {
        //  生成下载链接
        fileUtil.generateUrl(this.data.fileID).then(res => {
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
              title: this.data.operate_name + '失败',
              icon: 'none'
            });
          }
        });
      }

    } else {
      //  未登录
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
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
        title: this.data.operate_name + '失败',
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

          //  再次判断文件类型是否是其他，若是其他则弹出显示框，显示临时URL
          if (this.data.typeNum === 0 || this.data.typeNum === 3) {
            console.log(result);
            //  显示modal
            fileUtil.showModal('获取成功', '快去下载文件吧！\n（注意：链接有效期只有两个小时哦）', '一键复制', result)
          } else {
            wx.showToast({
              title: this.data.operate_name + '成功'
            });
          }
        },
        fail: error => {
          wx.hideLoading();
          wx.showToast({
            title: this.data.operate_name + '失败',
            icon: 'none'
          });
        }
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    if (this.data.isCheck && app.globalData.isLogin) {
      let data = JSON.stringify(this.data.data);

      if (e.from === 'menu') {
        return {
          title: this.data.fileInfo.fileName,
          path: '/pages/detail/detail?data=' + data
        }
      }
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      });
    }
  }
})