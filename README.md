# CoolTran

参加比赛的作品，开发周期三周，使用了 ColorUI 库，后台小程序登录是通过 Bmob 服务器中转请求获取 session_key，存储功能采用腾讯云提供的 Node.js SDK 接入对象存储 API。

创作初衷是想实现同 QQ 一样的面对面快传，来解决陌生微信用户之间互传文件的问题。目前版本技术成熟，可作为微信用户之间互传文件的平台，实现了一人上传文件，多人可获取的功能。

代码已移除 AppId 等敏感信息，可自行添加自己的 AppId 和 AppSecret 以配置后台环境，实现登录测试，详细添加方法见下文「使用方法」，若本地运行可通过修改 app.json 文件中 page 字段的顺序来查看不同页面。

## 使用方法

- 首先点击右上角 🌟Star ʕ •ᴥ•ʔ
- 获取 Demo 代码

  - git bash 中执行 git clone https://github.com/profoundly/CoolTran.git

  - 或 [点击此处](https://github.com/profoundly/CoolTran/releases) 下载最新版本的代码

- 解压后在微信开发者工具中打开 CoolTran 文件夹即可

### 如果需要登录测试，还需要配置 Bmob

在 [Bmob 官网](https://www.bmob.cn/) 注册后创建一个微信小程序应用，在应用的设置界面的应用密钥这一栏可以看到 Application ID 和 REST API Key，将 他们作为 app.js 第五行 _Bmob.initialize("yours Application ID", "yours REST API Key");_ 函数的第一、二个参数传入即可。

## 作者

深刻：<https://github.com/profoundly>

xdmqp：<https://github.com/xdmqp>

xylxxx：<https://github.com/xylxxx>

## 效果展示

<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/profoundly/data/master/cooltran/result/home.png" hspace="30px" />
  <img width="200" src="https://raw.githubusercontent.com/profoundly/data/master/cooltran/result/code.png" hspace="30px" />
  <img width="200" src="https://raw.githubusercontent.com/profoundly/data/master/cooltran/result/detail.png" hspace="30px" />
</p>

<p align="center">
  <img width="200" src="https://raw.githubusercontent.com/profoundly/data/master/cooltran/result/my.png" hspace="30px" />
  <img width="200" src="https://raw.githubusercontent.com/profoundly/data/master/cooltran/result/my-upload.png" hspace="30px" />
  <img width="200" src="https://raw.githubusercontent.com/profoundly/data/master/cooltran/result/my-download.png" hspace="30px" />
</p>
