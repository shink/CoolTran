const Bmob = require('bmob.js');
const common = require("common.js");

/**
 * 登录，得到code后请求session_key
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
              console.log(userData);
              var openid = userData.openid;

              wx.getUserInfo({
                success: res => {
                  console.log(res);
                  var userInfo = res.userInfo;
                  var avatarUrl = userInfo.avatarUrl;
                  var nickName = userInfo.nickName;

                  wx.setStorageSync('openid', openid);
                  wx.setStorageSync('userInfo', userInfo);
                  wx.setStorageSync('avatarUrl', avatarUrl);
                  wx.setStorageSync('nickName', nickName);

                  result.isLogin = true;
                  result.message = '登录成功';
                  resolve(result);
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
  })

  return promise;
}

/**
 * 检查session是否过期
 */
function checkSess(isLogin) {

  let promise = new Promise(function(resolve, reject) {
    var expired = true;

    wx.checkSession({
      success: res => {
        //  session未过期
        console.log('checkSession-success', res);
        expired = false;
        resolve(expired);
      },
      fail: res => {
        //  session过期
        console.log('checkSession-fail', res);

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