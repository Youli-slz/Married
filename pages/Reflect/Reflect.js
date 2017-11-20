var constants = require('../../static/ProtocolType.js')
var controller = require('../../utils/controller_onec.js');
var uInfo;
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Balance: "0.00"
  },

  /**
   * 获取账户余额
  */
  getbalance: function () {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_BALANCE,
      data:{
        action_name: 'get_balance',
        data: {
          user_id: uInfo.id,
        }
      }
    })
  },

  /**
   * 获取账户余额数据
  */
  getBalanceData: function (data) {
    if(data.code == 0){
      this.setData({
        Balance: data.data.balance
      })
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }
  },

  //提现接口
  Reflect: function () {
    wx.navigateTo({
      url:'../confirmReflect/confirm?Balance='+ this.data.Balance
    })
  },

  /**
   * 初始化页面请求
  */
  initPage: function () {
    this.getbalance();
  },

  /**
   * 获取信道的数据
  */
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch (method){
        case constants.GET_BALANCE:
          that.getBalanceData(ProtocolData);
          break;
      }
    } else {
      console.log(server);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uInfo = wx.getStorageSync('USER_INFO');
    console.log(uInfo)
    controller.init(this.initPage, this.getdata,)
    this.getbalance();
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