// 相关配置引入， 自定义配置config ， 腾讯wafer信道客户端sdk
import { $WxDialog, $WxToast } from './components/wx';
var qcloud = require('./static/bower_components/wafer-client-sdk/index');
var constants = require('./static/bower_components/wafer-client-sdk/lib/constants')
var config = require('./config');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;

var Socket = require('./utils/init.js');

//================================================================
/**
 * 各种自定义显示框
*/

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showFail = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};
//===============================================================

// 页面配置
App({
  // request : request,
  /**
   * 页面加载中生命周期
  */
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl);                   // 初始化客户端的登录地址， 以支持所有的会话操作
    this.login();                                                  // 调用登录函数
  },

  onHide: function () {
    // console.log('关闭信道')
    this.globalData.ishidden = true;
    // Socket.tunnel.close();
  },
  onShow: function ()  {
    this.globalData.ishidden = false;
    // Socket.on('')
    // Socket.CONNECT();
  },

  /**
   * 请求获取用户信息， 在获取信息的同时，如果没有登录 会通过login：true 自动登录并获取用户信息
  */
  getUserInfo: function () {
    var that = this;
    qcloud.request({                                              // 在没有登陆的时候会先请求登陆接口然后调用请求获取用户信息
      url: config.service.requestUrl,
      login: true,
      success(result) {
        showSuccess('登录成功');
        console.log('request success', result);
        console.log(result);
        that.globalData.userInfo = result.data.data.userInfo;                      // 将获取到的用户信息，赋值给全局变量
        wx.setStorage({
          key: 'USER_INFO',
          data: result.data.data.userInfo
        })
      },
      fail(error) {
        showFail('请求失败', error);
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
      }
    })
  },

  /**
   * 当再次同意获取用户信息后，显示设置页面修改授权
  */
  warningBox: function (val) {
    var that = this;
    if (val.confirm) {
      if (wx.openSetting) {                                                     // 当前微信的版本 ，是否支持openSetting
        wx.openSetting({
          success: (res) => {
            if (res.authSetting["scope.userInfo"]) {                            // 如果用户重新同意了授权登录
              wx.getUserInfo({                                                  // 跟上面的wx.getUserInfo  sucess处理逻辑一样
                success: function (res) {
                  that.getUserInfo();                                         // 在没有登陆的时候会先请求登陆接口然后调用请求获取用户信息
                }
              })
            } else {                                                            // 用户还是拒绝
              fail()
            }
          },
          fail: function () {                                                    // 调用失败，授权登录不成功
            fail()
          }
        })
      } else {
        fail()
      }
    }
  },

  /**
   * 登录页面方法（获取用户相关信息，传给服务器先关信息）
  */
  login: function () {
    var that = this
    var sucess = arguments[0] ? arguments[0] : function () { };                                       // 登录成功的回调
    var fail = arguments[1] ? arguments[1] : function () { };                                         // 登录失败的回调
    var title = arguments[2] ? arguments[2] : '授权登录失败，部分功能将不能使用，是否重新登录？';         // 当用户取消授权登录时，弹出的确认框文案

    var uInfo = wx.getStorageSync('USER_INFO');                                      // 登陆过后，用户信息会缓存
    console.log(uInfo)
    if (!uInfo) {                                                                            // 判断是否之前成功登陆过
      wx.login({
        success: function (res) {
          var code = res.code;
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.getUserInfo();
            },
            fail: function (res) {                                                             //用户点了“拒绝”
              wx.showModal({
                title: '提示',
                content: title,                                                               // 警告语
                showCancel: true,
                cancelText: "否",
                confirmText: "是",
                success: function (res) {
                  that.warningBox(res);
                }
              })
            }
          })
        },
        fail: function (res) {
          fail()
        }
      })
    } else {                                         // 如果登录过
      console.log(uInfo);
      // that.connect();
      that.globalData.userInfo = uInfo;
      return false;
    }
  },

  /**
   * 全局变量globalData
  */
  globalData: {
    default_avatar:'http://7xld1x.com1.z0.glb.clouddn.com/tmp/wxf4d6959f359f26ad.o6zAJs6e4iQOHuo7DT2vSURT-cTg.c7487d2bbdfec71659c8116ee0342a59.png',
    userInfo: null,
    // role: null                // 登录用户的角色  1.创建人 2.新郎 3.新娘 4.管理员 5.宾客 
    ishidden: false
  }
})