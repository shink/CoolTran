// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const user_db = cloud.database();
// 云函数入口函数
exports.main = async(event, context) => {

  var openid = event.openid;

  console.log(openid);

  try {
    return await user_db.collection('user').add({
      data: {
        openid: openid
      }
    });
  } catch (e) {
    console.log(e);
  }

}