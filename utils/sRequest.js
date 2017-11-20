var config = require('../config.js');
var qcloud = require('../static/bower_components/wafer-client-sdk/index');
var constants = require('../static/bower_components/wafer-client-sdk/lib/constants');
const SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;
var qinniu = require('../static/qiniu-sdk/sdk/qiniuUploader');

var Socket = require('./init.js');

var uptoken = '';
var Data_Content;
//========================================================================
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 1000
});

var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
});

var showFail = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    });
};
//========================================================================
// 请求成功状态的信息
let SuccessCode = {
    NORMAL: "",
    NO_DATA: "没有更多数据",
}

// 请求失败的错误状态信息
let ErrorCode = {
    URL_IS_NULL: 'URL为空',
    PARAMS_IS_NULL: '参数为空',
    CALLBACK_IS_NULL: '回调为空',
    SERVERNAME_IS_NULL: '服务名称为空',
    METHODNAME_IS_NULL: '方法名称为空',
    CALLBACK_SUCCESS_IS_NOT_FUNCTION: '回调的success不是一个function',
    CALLBACK_FAILURE_IS_NOT_FUNCTION: '回调的failure不是一个function'
}

var MessageCode = {
    SuccessCode: SuccessCode,
    ErrorCode: ErrorCode
}

/** 判断对象是否为函数 */
function isFunction(value) {
    if (typeof (value) == "function") {
        return true;
    } else {
        return false;
    }
}

// 判断是否为空函数
function isNull(value) {
    if (value == undefined || value == null || value == '' || value == 'null' || value == '[]' || value == '{}') {
        return true
    }
    return false
}



/**
 * websocket 请求默认参数
*/
function setSocketDefault() {
    return {
        userid: getApp().globalData.userInfo.id,
        appid: config.header.AppId
    }
}

/**
 * @param {Object} data 请求的参数
 * @param {String} servername 服务名称
 * @param {String} methodname 方法名称
 * 
*/
function websocketRequest( opt = {} ){
    var data;
    const options = Object.assign({}, setSocketDefault(), opt);
    Socket.tunnel.on('connect', ()=>{console.log('sRequest: 链接')})
    Socket.tunnel.on('error', (error)=>{console.log('sRequest: '+error)})
    Socket.tunnel.on('reconnecting', ()=>{console.log('sRequest: reconnecting')})
    Socket.tunnel.on('reconnect', ()=>{console.log('sRequest: reconnect')})
    Socket.tunnel.emit('socket',JSON.stringify(options));
    // console.log(JSON.stringify(options));
}
 





/**
 * @param {String} url host后面具体的请求路径
 * @param {Object} params 请求要传的参数
 * @param {String} servername 服务名称
 * @param {String} methodname 方法名称
 * @param {Function} success 请求成功后的回调函数
 * @param {Function} failure 请求失败后的回调函数
 * @param {String} method 请求的方法 默认为 "POST"
*/
function networkRequest(
    url,
    params,
    servername,
    methodname,
    success,
    failure,                     // 初始化后即可以通过传参重新定义这个方法
    method = "POST"
) {
    try {
        if (isNull(url)) throw MessageCode.ErrorCode.URL_IS_NULL;
        if (isNull(params)) throw MessageCode.ErrorCode.PARAMS_IS_NULL;
        if (isNull(servername)) throw MessageCode.ErrorCode.SERVERNAME_IS_NULL;
        // if (isNull(methodname)) throw MessageCode.ErrorCode.METHODNAME_IS_NULL;

        qcloud.request({
            url: url,
            data: params,
            method: method,
            header: {
                ServerName: servername,                               // 请求的服务名
                MethodName: methodname,                               // 请求的方法名
                UserId: getApp().globalData.userInfo.id,          // 用户个人userid 直接从全局变量中获取
                // AppId: config.header.AppId,                           // 配置文件中定义
            },
            success: function (res) {
                var data = res.data;
                if (data.code == 0) {
                    if (isFunction(success)) {
                        if (isNull(data)) {
                            success(null);
                        } else {
                            success(data.data);
                        }
                    } else {
                        console.log(MessageCode.ErrorCode.CALLBACK_SUCCESS_IS_NOT_FUNCTION);
                    }
                }
                else {
                    if (isFunction(failure)) {
                        failure(data.msg);
                    }
                    else {
                        failure(MessageCode.ErrorCode.CALLBACK_FAILURE_IS_NOT_FUNCTION);
                    }
                }
            },
            fail: function (res) {
                if (isFunction(failure)) {
                    failure(res)
                } else {
                    failure(MessageCode.ErrorCode.CALLBACK_FAILURE_IS_NOT_FUNCTION);
                }
            }
        })
    }
    catch (error) {
        if (isFunction(failure)) {
            failure(error);
        } else {
            failure(MessageCode.ErrorCode.CALLBACK_FAILURE_IS_NOT_FUNCTION);
        }
    }
}

/**
 * 默认参数
*/
function setDefaults() {
    return {
        hostmethod: 'R',
        methodname: '',
        success: function (data) { console.log(data) },
        failure: function (msg) { console.log(msg) }
    }
}
/**
 * @param {String} hostmethod  用来判断请求的是那个url  有三个参数 R（普通请求） WR (信道请求) TU(信道服务)
 * @param {String} url host后面具体的请求路径
 * @param {Object} params 请求要传的参数
 * @param {String} servername 服务名称
 * @param {String} methodname 方法名称
 * @param {Function} success 请求成功后的回调函数
 * @param {Function} failure 请求失败后的回调函数
 * @param {String} method 请求的方法 默认为 "POST"
*/
function GET(opt = {}) {
    const options = Object.assign({}, setDefaults(), opt);
    if (options.hostmethod == 'R') {
        networkRequest(config.service.hostUrl + options.url, options.params, options.servername, options.methodname, options.success, options.failure, "GET");
    } else if (options.hostmethod == 'WR') {
        networkRequest(config.service.requestUrl + options.url, options.params, options.servername, options.methodname, options.success, options.failure, "GET");
    } else {
        networkRequest(config.service.tunnelUrl + options.url, options.params, options.servername, options.methodname, options.success, options.failure, "GET");
    }
}

/**
 * @param {String} hostmethod  用来判断请求的是那个url  有三个参数 R（普通请求） WR (信道请求) TU(信道服务)
 * @param {String} url host后面具体的请求路径
 * @param {Object} params 请求要传的参数
 * @param {String} servername 服务名称
 * @param {String} methodname 方法名称
 * @param {Function} success 请求成功后的回调函数
 * @param {Function} failure 请求失败后的回调函数
 * @param {String} method 请求的方法 默认为 "POST"
*/
function POST(opt = {}) {
    const options = Object.assign({}, setDefaults(), opt);
    console.log(options);
    if (options.hostmethod == 'R') {
        networkRequest(config.service.hostUrl + options.url, options.params, options.servername, options.methodname, options.success, options.failure);
    } else if (options.hostmethod == 'WR') {
        networkRequest(config.service.requestUrl + options.url, options.params, options.servername, options.methodname, options.success, options.failure);
    } else {
        networkRequest(config.service.tunnelUrl + options.url, options.params, options.servername, options.methodname, options.success, options.failure);
    }
}


/**
 * 协议类别默认参数
*/
function proDefault() {
    return {
        pro_type: config.Type.ProtocolType,
        meth_type: 'post'
    }
}

/**
 * 判断调用的是wss方法 还是 https
 * @param {String} pro_type
 * @param {String} meth_type
*/

function checkMethod (opt = {}) {
    const options = Object.assign({}, proDefault(), opt);
    console.log(options)
    if(options.pro_type == 'wss'){
        websocketRequest(options);
    }else{
        if(options.meth_type == 'post'){
            POST(options);
        } else {
            GET(options);
        }
    }
}

function getUptoken(
    // type,                                                                         // 1 图片   2视频
    // filePaths,                                                                   // 要上传文件的路径， 可以上传多个， 看页面定义获取几个
    // success,                                                                     // 上传成功后的回调函数
    // failure = function (errormsg) { console.log(errormsg) }　　　　　　　　　　　　　 // 上传失败后的回调函数
    opt = {type: 1,  failure : function (errormsg) { console.log(errormsg)} }
) {
    POST({
        url: '/socket/response.do',
        params: {
            action_name: "upload_token",
            data: "upload_token"
        },
        servername: 'wedding',

        success: function (data) {
            console.log(data);
            uptoken =  data.token;
            if(opt.type == 1){
                UploadImg(uptoken,opt.filePaths, opt.success, opt.failure);
            } else {
                UploadVideo(uptoken,opt.filePaths, opt.success, opt.failure);          
            }
        },
        failure: function (msg) {      // 可以传 也可以不传
            console.log(msg);
        }
    })
}

/**
 * 通过七牛上传图片 
*/
function UploadImg(
    uptoken,
    filePaths,                                                                   // 要上传文件的路径， 可以上传多个， 看页面定义获取几个
    success,                                                                     // 上传成功后的回调函数
    failure                                             　　　　　　　　　　　　　 // 上传失败后的回调函数
) {
    var that = this;
    console.log(filePaths);
    for (var i = 0; i < filePaths.length; i++) {
        var filePath = filePaths[i];
        qinniu.upload(filePath, (res) => {
            if (isFunction(success)) {
                success(res);
                // console.log(res);
                // console.log("11"+res);
            }
        }, (error) => {
            failure('error' + error);
        }, {
                region: 'ECN',
                domain: 'https://oss.ririyuedu.com',                              // bucket域名， 下载资源时用到
                key: '',                                 // key自定义文件，【非必须】如果不设置，默认为使用微信小程序API的临时文件名，
                //一下方法三选一， 优先级为 utoken > uptokenURL > uptokenFunc  
                uptoken: uptoken,                    // 由其他程序生成七牛
                // uptokenURL: 'url',                               // 从指定url通过HTTP GET获取uptoken, 返回的格式必须是json 且包含uptoken字段， 例如： {"uptoken": "[yourTokenString]"}
                // uptokenFunc: function() {return '[yourtokenString]';}
            });
    }
}


function UploadVideo(
    uptoken,
    filePath,                                                                   // 要上传文件的路径
    success,                                                                     // 上传成功后的回调函数
    failure                                             　　　　　　　　　　　　　 // 上传失败后的回调函数
) {
    var that = this;
    // console.log(uptoken);
    // console.log(filePaths);
    // for (var i = 0; i < filePaths.length; i++) {
        // var filePath = filePaths[i];
        qinniu.upload(filePath, (res) => {
            if (isFunction(success)) {
                success(res);
                // console.log("11"+res);
            }
        }, (error) => {
            failure('error' + error);
        }, {
                region: 'ECN',
                domain: 'https://oss.ririyuedu.com',                              // bucket域名， 下载资源时用到
                key: '',                                 // key自定义文件，【非必须】如果不设置，默认为使用微信小程序API的临时文件名，
                //一下方法三选一， 优先级为 utoken > uptokenURL > uptokenFunc  
                uptoken: uptoken,                    // 由其他程序生成七牛
                // uptokenURL: 'url',                               // 从指定url通过HTTP GET获取uptoken, 返回的格式必须是json 且包含uptoken字段， 例如： {"uptoken": "[yourTokenString]"}
                // uptokenFunc: function() {return '[yourtokenString]';}
            });
    // }
}

module.exports = {
    Upload: getUptoken,
    FunType: checkMethod
}

