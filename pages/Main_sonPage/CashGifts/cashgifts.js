// pages/Main_sonPage/CashGifts/cashgifts.js
var constants = require('../../../static/ProtocolType.js')
// var sq = require('../../../utils/sRequest.js');
var controller = require('../../../utils/controller_onec.js');
var app = getApp();
var readyPay = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wish: '新婚快乐',
    Card_Id: null,
    winWidth: null,
    winHeight: null,
    CASH: "0.00",
    ISSEND: false,
    InputValue: '',
    Balance: null,
    readyPay:false,
    avaterPic: app.globalData.userInfo.avatarUrl,
    paymethod: ['微信支付', '余额支付'],
    send_money_count: 0.00,
    sendList: []
  },

  /**
   * 获取用户输入的金额
  */
  getmoney: function (e) {
    var money
    if(e.detail.value == ''){
      money = '0.00';
    } else {
      money= parseFloat(e.detail.value).toFixed(2);
    }
    this.setData({
      CASH: money,
    })
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
          user_id: app.globalData.userInfo.id,
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

  /**
   * 转到发送礼金的页面
   */
  TosendCash:function () {
     this.setData({
       ISSEND: true,
       InputValue: '',
       CASH: '0.00',
     })
  },

  bindpay: function (e) {
    console.log(e.detail.value);
    var type = e.detail.value;
    if(type == 0){
      this.sendCash();
    } else {
      this.sendByBalance();
    }
  },

  getWish: function (e) {
    this.setData({
      wish: e.detail.value
    })
  },

  /**
   * 用余额发礼金
  */
  sendByBalance: function () {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.SEND_CASHGIFT,
      data:{
        action_name: 'send_cash_gift',
        data:{
          user_id: app.globalData.userInfo.id,
          wedding_id: that.data.Card_Id,
          money: that.data.CASH,
          wish: that.data.wish
        }
      }
    })
  },

  getsendbybalData: function (data) {
    if(data.code == 0){
      wx.showToast({
        title: '发送成功'
      })
    }else {
      wx.showToast({
        title: data.msg,
        image: '../../../assets/image/cuo.png'
      })
    }
  },

  /**
   * 发送礼金
  */
  sendCash: function () {
    var that = this;
    console.log(that.data.Card_Id);
    if(!readyPay){
      controller.REQUEST({
        servername: constants.CONTANT_SERVER_NAME,
        methodname: constants.GET_PAY_PARAMS,
        data:{
          action_name: 'get_pay_params',
          data: {
            user_id: app.globalData.userInfo.id,
            pay_type: 1,                                  // 支付类型固定为1
            pay_target: 'cashGift',
            params:{
              card_id: parseInt(that.data.Card_Id),
              money: that.data.CASH,
              wish: that.data.wish
            }
          }
        },
      })
    } else{
      return false;
    }
  },

  /**
   * 发送礼金后返回的数据
  */
  getSendCashData: function (data) {
    var that = this;
    if(data.code == 0){
      if(!readyPay){
        that.pay(data.data);
        readyPay = true;
      }
    } else {
      wx.showModal({
        title: 'error',
        content: data.msg,
        confirmText: '确定'
      })
    }
  },

  /**
   *调起支付 
  */
  pay: function (val){
    var that = this;
    readyPay = false;
    wx.requestPayment({
      'timeStamp': val.timeStamp,
      'nonceStr': val.nonceStr,
      'package': val.package,
      'signType': 'MD5',
      'paySign': val.paySign,
      'success':function(res){
        console.log(res);
        that.setData({
          ISSEND: false
        })
      },
      'fail':function(res){
        console.log(res);
        that.cancelPay(val.bill_no)
      }
   })
  },

  /**
   * 取消支付接口
  */
  cancelPay: function (val) {
    var that = this;
    readyPay = false;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.CANCEL_PAY,
      data:{
        action_name: 'cancel_pay',
        data: {
          bill_no: val,
          pay_type: 1,                                  // 支付类型固定为1
          pay_target: 'cashGift',
        }
      }
    })
  },

  /**
   * 获取取消数据后的数据
  */
  getCancelPayData: function (data) {
    if(data.code == 0){
      this.setData({
        CASH: '0.00',
        InputValue: ''
      })
    } else {
      wx.showToast({
        title: '取消失败'+ data.msg,
        duration: 2000
      })
    }
  },
 
  /**
   * 获取设备信息
  */
  getwindowinfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight 
        });
      }
    })
  },

  /**
   * 发送的礼金列表
  */
  getsendMoneyList: function () {
    var that = this;

    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.SEND_CASHGIFT_LIST,
      data:{
        action_name: 'send_cash_gift_list',
        data:{
          wedding_id: that.data.Card_Id,
          user_id: app.globalData.userInfo.id
        }
      }
    })
  },

  /**
   * 获取礼金列表数据
  */
  getSendMoneyData: function (data) {
    if(data.code == 0){
      console.log(data.data);
      if(data.data.list){
        console.log(111);
        for(var i=0; i< data.data.list.length; i++){
          data.data.list[i].create_at = this.convert_time(data.data.list[i].create_at);
        }
      }
      this.setData({
        send_money_count: data.data.money_count,
        sendList: data.data.list
      })
    } else {
      wx.showToast({
        title: data.msg,
        image: '../../../assets/image/cuo.png',
        duration: 2000
      })
    }
  },

  /**
   * 时间戳转换为时间
   */
  convert_time: function (t) {
    var time;
    var date = new Date(t*1000);
    var year = date.getFullYear();
    var month = this.addZero(date.getMonth() + 1);
    var day = this.addZero(date.getDate());
    var hour = this.addZero(date.getHours());
    var minute = this.addZero(date.getMinutes());
    time =  month + '月' + day + '日'+ ' ' + hour + ':' + minute;

    return time;
  },

  addZero: function (temp) {
    if(temp < 10)
      return "0"+temp;
    else 
      return temp;
  },

  /**
   * 从信道获取数据
  */
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch (method){
        case constants.GET_BALANCE:
          that.getBalanceData(ProtocolData);
          break;
        case constants.GET_PAY_PARAMS:
          that.getSendCashData(ProtocolData);
          break;
        case constants.CANCEL_PAY:
          that.getCancelPayData(ProtocolData);
          break;
        case constants.SEND_CASHGIFT:
          that.getsendbybalData(ProtocolData);
          break;
        case constants.SEND_CASHGIFT_LIST:
          that.getSendMoneyData(ProtocolData);
          break;
      }
    } else {
      console.log(server);
    }
  },

  /**
   * 创建页面初始化请求
  */
  initPage: function () {
    var that = this;
    this.getbalance();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      Card_Id: options.wedding_id,
    })
    this.getwindowinfo();
    this.getbalance();
    this.getsendMoneyList();
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