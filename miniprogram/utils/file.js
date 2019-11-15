/**
 * 根据临时路径获取文件大小，并将单位B换算成MB、GB
 */
function getSize(path, size = -1) {
  let promise = new Promise(function(resolve, reject) {

    var sizeStr = "";

    if (size === -1) {
      wx.getFileInfo({
        filePath: path,
        success: res => {
          sizeStr = sizeConver(res.size);
        },
        fail: error => {
          console.log(error);

          sizeStr = "未知";
        },
        complete: () => {
          resolve(sizeStr);
        }
      });
    } else {
      sizeStr = sizeConver(size);
      resolve(sizeStr);
    }

  });

  return promise;
}

/**
 * 转换size单位
 */
function sizeConver(limit) {
  let size = "";

  if (limit < 1024) { //如果小于1KB转化成B
    size = limit.toFixed(2) + "B";
  } else if (limit < 1024 * 1024) { //如果小于1MB转化成KB
    size = (limit / 1024).toFixed(2) + "K";
  } else if (limit < 1024 * 1024 * 1024) { //如果小于1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + "M";
  } else { //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "G";
  }
  let sizeStr = size + "";

  let len = sizeStr.indexOf("\.");
  let dec = sizeStr.substr(len + 1, 2);
  if (dec == "00") { //当小数点后为00时 去掉小数部分
    sizeStr = sizeStr.substring(0, len) + sizeStr.substr(len + 3, 2);
  }
  return sizeStr;
}

module.exports = {
  getSize: getSize
}