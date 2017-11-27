/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'access.djtaoke.cn/wafer';              //  阿里云 wxapi.duobb.cn/wafer        // 腾讯云 47602916.qcloud.la
var Rhost = 'access.djtaoke.cn';              // 只用作普通请求

var config = {

    service: {
        host,
        // 登录地址，用于建立会话
        loginUrl: `https://${host}/login`,

        // 请求地址，用于测试会话
        requestUrl: `https://${host}/user`,

        // 信道服务地址
        tunnelUrl: `https://${host}/tunnel`,

        // 普通的获取请求地址
        hostUrl: `https://${Rhost}`,        
    },
    /**
     * 请求头带的参数之一
    */
    header: {
      AppId: 'wxb2de1aacb42e47df'             // 每个项目都有一个AppId
    },
    
    Type:{
        ProtocolType: "wss"             // wss: websocket协议    https: https协议
    }
};

//调用协议种类 https 、 wss

module.exports = config;

