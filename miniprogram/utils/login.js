const Bmob = require('bmob.js');
const common = require("common.js");
const md5Util = require("md5.js");

const app = getApp();

/**
 * 登录，得到code后请求session_key，并将信息写入缓存，未操作app.globalData
 */
function doLogin() {

  let promise = new Promise(function(resolve, reject) {

    var result = {};
    result.isLogin = false;
    result.message = "";

    wx.login({
      success: res => {
        if (res.code) {

          Bmob.User.requestOpenId(res.code, {
            success: userData => {
              console.log('userData', userData);
              var openid = md5Util.hexMD5(userData.openid);

              wx.getUserInfo({
                success: res => {
                  var userInfo = res.userInfo;
                  var avatarUrl = userInfo.avatarUrl;
                  var nickName = userInfo.nickName;

                  wx.setStorageSync('openid', openid);
                  wx.setStorageSync('userInfo', userInfo);
                  wx.setStorageSync('avatarUrl', avatarUrl);
                  wx.setStorageSync('nickName', nickName);

                  //  写入缓存后，查看数据库中是否已添加，若未添加则添加用户。
                  wx.cloud.callFunction({
                    name: 'user-query',
                    data: {
                      openid: openid
                    },
                    success: res => {
                      if (res.result.data.length != 0) {
                        result.isLogin = true;
                        result.message = '登录成功';
                        resolve(result);
                      } else {
                        //  未写入数据库，则添加
                        wx.cloud.callFunction({
                          name: 'user-login',
                          data: {
                            openid: openid
                          },
                          success: res => {
                            console.log(res);
                            result.isLogin = true;
                            result.message = '登录成功';
                            resolve(result);
                          }
                        });
                      }

                    }
                  });
                },

                fail: error => {
                  console.log(error);

                  result.isLogin = false;
                  result.message = '获取用户信息失败';
                  resolve(result);
                }
              })
            },

            fail: error => {
              console.log(error);

              result.isLogin = false;
              result.message = '请求错误';
              resolve(result);
            }

          })
        } else {

          result.isLogin = false;
          result.message = '登录出错';
          resolve(result);
        }
      },

      fail: error => {
        console.log(error);

        result.isLogin = false;
        result.message = '登录失败';
        resolve(result);
      }
    })
  });

  return promise;
}

/**
 * 检查session是否过期
 */
function checkSess() {

  let promise = new Promise(function(resolve, reject) {
    //  是否过期
    var expired = true;

    wx.checkSession({
      success: res => {
        //  session未过期
        expired = false;
        resolve(expired);
      },
      fail: res => {
        //  session过期
        expired = true;
        resolve(expired);
      }
    })
  })

  return promise;
}

module.exports = {
  doLogin: doLogin,
  checkSess: checkSess
}