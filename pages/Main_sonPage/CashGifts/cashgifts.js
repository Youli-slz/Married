// pages/Main_sonPage/CashGifts/cashgifts.js
var sq = require('../../../utils/sRequest.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: null,
    winHeight: null,
    CASH: "0.00",
    ISSEND: true,
    InputValue: '',
    Balance: null,
  },

  /**
   * 获取用户输入的金额
  */
  getmoney: function (e) {
    console.log(e)
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
    sq.POST({
      url: '/socket/response.do',
      servername: ' logic',
      params:{
        action_name: 'get_balance',
        data: {
          user_id: app.globalData.userInfo.id,
        }
      },
      success: function (res) {
        that.setData({
          Balance: res.balance,
        })
      }
    })
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

  /**
   * 发送礼金
  */
  sendCash: function () {
    var that = this;
    console.log(this.data.Balance);
    if(that.data.CASH > that.data.Balance ){
      console.log('调用支付接口');
    sq.POST({
      url: '/socket/response.do',
      servername: ' logic',
      params:{
        action_name: 'get_pay_params',
        data: {
          user_id: app.globalData.userInfo.id,
          pay_type: 1,                                  // 支付类型固定为1
          pay_target: 'recharge',
          money: that.data.CASH,
        }
      },
      success: function (res) {
        // console.log(res);
        that.pay(res)
      }
    })
    } else{
      console.log('从本地余额扣除');
    }
        // that.setData({
        //   ISSEND: false,
        // })

  },

  /**
   *调起支付 
  */
  pay: function (val){
    var that = this;
    wx.requestPayment({
      'timeStamp': val.timeStamp,
      'nonceStr': val.nonceStr,
      'package': val.package,
      'signType': 'MD5',
      'paySign': val.paySign,
      'success':function(res){
        console.log(res);
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
    sq.POST({
      url: '/socket/response.do',
      servername: ' logic',
      params:{
        action_name: 'cancel_pay',
        data: {
          bill_no: val,
          pay_type: 1,                                  // 支付类型固定为1
          pay_target: 'cashGift',
        }
      },
      success: function (res) {
        console.log(res);
        that.setData({
          CASH: '0.00',
          InputValue:''
        })
      }
    })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getwindowinfo();
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