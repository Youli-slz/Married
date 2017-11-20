var sq = require('../../utils/sRequest.js');
var constants = require('../../static/ProtocolType.js');
var controller = require('../../utils/controller_onec.js');
var uInfo;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Balance: null,
    inputValue: '',
  },

   /**
   * 请求获取账户余额
  */
  // getbalance: function () {
  //   var that = this;
  //   controller.REQUEST({
  //     servername: constants.CONTANT_SERVER_NAME,
  //     methodname: constants.GET_BALANCE,
  //     data:{
  //       action_name: 'get_balance',
  //       data:{
  //         user_id: uInfo.id
  //       }
  //     }
  //   })
  // },

  // /**
  //  * 获取余额的数据
  // */
  // getBalanceData: function (data) {
  //   var that = this;
  //   that.setData({
  //     Balance: data.balance
  //   })
  // },

  /**
   * 获取提现金额
  */
  reflectMoney: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  Rconfirm: function () {
    var that = this;
    if(this.data.inputValue == ''){
      wx.showToast({
        title: '请输入提现金额',
        image:'../../assets/image/cuo.png'
      })
      return false;
    } else if(this.data.Balance*(1-0.006) < this.data.inputValue){
      wx.showToast({
        title:'余额不足',
        image: '../../assets/image/cuo.png'
      })
    } else if(parseFloat(that.data.inputValue) < 2){
      wx.showToast({
        title: '提取金额小于2元',
        image: '../../assets/image/cuo.png'
      })
    }else {
      wx.showModal({
        title: '提示',
        content:'是否提现'+ this.data.inputValue + '元',
        success: function () {
          controller.REQUEST({
            servername: constants.CONTANT_SERVER_NAME,
            methodname: constants.WITH_DRAW_DEPOSIT,
            params:{
              action_name:'withdraw_cash',
              data:{
                user_id: uInfo.id,
                open_id: uInfo.openId,
                money: that.data.inputValue
              }
            }
          })
        }
      })
    }
  },

  /**
   * 显示提现成功消息
  */
  reflectSuccess: function (val) {
    console.log(val.code);
    if(data.code == 0){
      wx.showtoast({
        title: '提现成功',
        icon: 'success',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: val.msg,
        image: '../../assets/image/cuo.png'
      })
    }
  },

  /**
   * 从信道获取数据
  */
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch (method) {
        case constants.WITH_DRAW_DEPOSIT:
          that.reflectSuccess(ProtocolData);
          break;
      }
    } else {
      console.log(server);
    }
  },

  /**
   * 初始化页面请求
  */
  initPage: function () {
    var that = this;
    that.getbalance();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      Balance: options.Balance
    })
    uInfo = wx.getStorageSync('USER_INFO');
    controller.init( this.initPage, this.getData,);
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