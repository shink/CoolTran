/**
 * 转换size单位
 */
function converSize(limit) {
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

/**
 * 产生一个未使用过的code
 */
function generateCode() {

  let promise = new Promise(function(resolve, reject) {

    var code = getRandomCode();

    queryCode(code).then(res => {
      if (res[0]) {
        //  需要结束
        resolve(res[1]);
      } else {
        //  重复，不能结束，进行递归
        return generateCode();
      }
    });

  });

  return promise;
}

/**
 * 产生四位数字+字母随机字符
 */
function getRandomCode() {
  var code = "";

  const array = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  let letter = Math.round(Math.random * 2);

  for (let i = 0; i < 4; i++) {
    let id = Math.round(Math.random() * 61);
    code += array[id];
  }
  return code;
}

/**
 * 查询code
 */
function queryCode(code) {
  let promise = new Promise(function(resolve, reject) {
    //  result[0] 代表是否需要结束，true：需要结束，false：不需要结束
    var result = [false, ''];

    wx.cloud.callFunction({
      name: 'query-code',
      data: {
        code: code
      },
      success: res => {
        let data = res.result.data;

        if (data.length === 0) {
          //  查询成功，code未重复
          result = [true, code];
        } else {
          //  查询成功，code重复,则继续生成code并判断
          result[0] = false;
        }
      },
      fail: error => {
        //  查询失败
        result[0] = true;
      },
      complete: () => {
        resolve(result);
      }
    });
  });

  return promise;
}

/**
 * 判断文件类型：0.其他 1.图片 2.视频
 */
function judgeType(type) {
  const imageType = ['jpg', 'JPG', 'jpeg', 'JPEG', 'png', 'PNG', 'gif', 'GIF'];
  const videoType = ['mp4', 'MP4'];

  if (imageType.indexOf(type) > -1) {
    //  是图片
    return 1;
  } else if (videoType.indexOf(type) > -1) {
    //  是视频
    return 2;
  } else {
    return 0;
  }
}

/**
 * 保存图片到本地
 */
function saveImage(path) {
  let promise = new Promise(function(resolve, reject) {

    let success = false;

    wx.saveImageToPhotosAlbum({
      filePath: path,
      success: res => {
        console.log(res);
        success = true;
        resolve(success);
      },
      fail: error => {
        console.log(error);
        success = false;
        resolve(success);
      }
    })

  });
  return promise;
}

/**
 * 保存视频到本地
 */
function saveVideo(path) {
  let promise = new Promise(function(resolve, reject) {

    let success = false;

    wx.saveVideoToPhotosAlbum({
      filePath: path,
      success: res => {
        console.log(res);
        success = true;
        resolve(success);
      },
      fail: error => {
        console.log(error);
        success = false;
        resolve(success);
      }
    })

  });
  return promise;
}

/**
 * 生成两小时Url
 * 
 */
function generateUrl(fileID) {
  let promise = new Promise(function(resolve, reject) {

    let result = '';

    wx.cloud.getTempFileURL({
      fileList: [fileID],
      success: res => {
        result = res.fileList[0].tempFileURL;
        resolve(result);
      },
      fail: error => {
        console.log(error);
        result = '';
        resolve(result);
      }
    });

  });
  return promise;
}

module.exports = {
  converSize: converSize,
  generateCode: generateCode,
  judgeType: judgeType,
  saveImage: saveImage,
  saveVideo: saveVideo,
  generateUrl: generateUrl
}