// 相关配置引入
import { $WxDialog, $WxToast } from '../components/wx';
var qcloud = require('../static/bower_components/wafer-client-sdk/index');
var constants = require('../static/bower_components/wafer-client-sdk/lib/constants')
var config = require('../config');
var request = require('../utils/sRequest');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;

//toast
//成功提示
var showSuccess = text => $WxToast.show({
    type: 'success',
    timer: 1500,
    color:'#fff',
    text: text,
    success: () =>console.log('完成')
})

function login() {
    var that = this;
    var sucess = arguments[0] ? arguments[0] : function () { };                                       // 登录成功的回调
    var fail = arguments[1] ? arguments[1] : function () { };                                         // 登录失败的回调
    var title = arguments[2] ? arguments[2] : '授权登录失败，部分功能将不能使用，是否重新登录？';         // 当用户取消授权登录时，弹出的确认框文案

    var uInfo = wx.getStorageSync('USER_INFO');
    if (!uInfo) {                                                                            // 判断是否之前成功登陆过
      wx.login({
        success: function (res) {
          var code = res.code;
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              getUserInfo();
            },
            fail: function (res) {                                                             //用户点了“拒绝”
              wx.showModal({
                title: '提示',
                content: title,                                                               // 警告语
                showCancel: true,
                cancelText: "否",
                confirmText: "是",
                success: function (res) {
                  warningBox(res);
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
    //   that.globalData.userInfo = uInfo;
      return false;
    }
}

  function warningBox (val) {
    var that = this;
    if (val.confirm) {
      if (wx.openSetting) {                                                     // 当前微信的版本 ，是否支持openSetting
        wx.openSetting({
          success: (res) => {
            if (res.authSetting["scope.userInfo"]) {                            // 如果用户重新同意了授权登录
              wx.getUserInfo({                                                  // 跟上面的wx.getUserInfo  sucess处理逻辑一样
                success: function (res) {
                  getUserInfo();                                           // 在没有登陆的时候会先请求登陆接口然后调用请求获取用户信息
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
  }

function getUserInfo () {
    var that = this;
    qcloud.request({                                              // 在没有登陆的时候会先请求登陆接口然后调用请求获取用户信息
      url: config.service.requestUrl,
      login: true,
      success(result) {
        showSuccess('登录成功');
        console.log('request success', result);
        console.log(result);
        // that.globalData.userInfo = result.data.data.userInfo;                      // 将获取到的用户信息，赋值给全局变量
        wx.setStorage({
          key: 'USER_INFO',
          data: result.data.data.userInfo
        })
      },
      fail(error) {
        // showFail('请求失败', error);
        console.log('request fail', error);
      },

      complete() {
        console.log('request complete');
      }
    })
  }

module.exports = {
    LOGIN: login,
}