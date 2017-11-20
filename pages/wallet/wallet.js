// pages/wallet/wallet.js
var constants = require('../../static/ProtocolType.js');
var controller = require('../../utils/controller_onec.js');
var uInfo;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Balance: {recharge:"0.00", reward:"0.00", balance:"0.00"},
    selectArea: '',
    showlist: false,
    descList:[]
  },

  /**
   * 显示列表的操作
  */
  showdetail: function () {
    this.setData({
      showlist: !this.data.showlist,
    })
    if(!this.data.selectArea){
      this.setData({
        selectArea: 'rotateRight',
      })
    } else if(this.data.selectArea == 'rotateRight') {
      this.setData({
        selectArea: 'rotateLeft',
      })
    } else {
      this.setData({
        selectArea: 'rotateRight',
      })
    }
    console.log(this.data.showlist)
    this.getbillList();
  },

  /**
   * to 提现页面
  */
  toReflect: function () {
    wx.navigateTo({
      url:'../Reflect/Reflect'
    })
  },

  /**
   * 发送获取账户余额请求
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
    var that = this;
    that.setData({
      Balance: data
    })
  },


  /**
   * 请求获取账单详情
  */
  getbillList: function () {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_BALANCE_INFORMATION,
      data:{
        action_name: 'get_balance_information',
        data:{
          user_id: uInfo.id
        }
      }
    })
  },

  /**
   * 获取账单详情数据
  */
  getBillData: function (data) {
    var that = this;
    that.setData({
      descList: data
    })
  },

  /**
   * 获取个人信息
  */


  /**
   * 从信道获取数据并判断相应请求返回数据
  */
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data).data;
      switch (method){
        case constants.GET_BALANCE:
          that.getBalanceData(ProtocolData);
          break;
        case constants.GET_BALANCE_INFORMATION:
          that.getBillData(ProtocolData);
          break;
      }
    } else {
      console.log(server);
    }
  },

  /**
   * 创建页面时初始化页面请求
  */
  initPage: function () {
    var that = this;
    that.getbalance();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    uInfo = wx.getStorageSync('USER_INFO');
    that.getbalance();
    this.setData({
      userId: uInfo.id
    })
    controller.init(this.initPage, this.getdata,);
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