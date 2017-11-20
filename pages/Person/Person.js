var config = require('../../config');
var qcloud = require('../../static/bower_components/wafer-client-sdk/index');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl:'',
    nickname: '',
    Name: '无',
    Phone:'无',
  },

  /**
   * 转到个人中心设置页面
  */
  toSet: function () {
    wx.navigateTo({
      url: './person_set/person_set?name='+ this.data.Name + '&phone=' + this.data.Phone 
    })
  },

  /**
   * 转到钱包页面
  */
  toWallet: function () {
    wx.navigateTo({
      url: '../wallet/wallet'
    })
  },

  getserinfo: function () {
    var that = this;
    qcloud.request({                                              // 在没有登陆的时候会先请求登陆接口然后调用请求获取用户信息
      url: config.service.requestUrl,
      login: true,
      success(result) {
        console.log(result.data.data.userInfo);
        var info = result.data.data.userInfo;
        that.setData({
          avatarUrl: info.avatarUrl,
          nickname: info.nickName,
          Name: info.name == ''? '暂无' : info.name,
          Phone: info.phone == ''? '暂无': info.phone
        })
      },
      fail(error) {
        console.log('request fail', error);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getserinfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.getserinfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})