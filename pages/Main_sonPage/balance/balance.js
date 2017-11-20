
var constants = require('../../../static/ProtocolType.js');
var controller = require('../../../utils/controller_onec.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Card_Id: null,
    SumMoney: 0.00,
    MoneyList: [],
  },

  /**
   * 获取收到礼金
  */
  getMoneyList: function () {
    var that = this;

    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_CASHGIFT_LIST,
      data:{
        action_name: 'get_cash_gift_list',
        data:{
          wedding_id: that.data.Card_Id
        }
      }
    })
  },

  /**
   * 获取收到礼金数据
  */
  getMoneyData: function (data) {
    if(data.code == 0){
      console.log(data.data);
      if(data.data.list.length > 0){
        for(var i=0; i<data.data.list.length; i++){
          data.data.list[i].create_at = this.convert_time(data.data.list[i].create_at);
        }
      }
      this.setData({
        MoneyList: data.data.list,
        SumMoney: data.data.money_count
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
    time = year + '年' + month + '月' + day + '日'+ ' ' + hour + ':' + minute;

    return time;
  },

  addZero: function (temp) {
    if(temp < 10)
      return "0"+temp;
    else 
      return temp;
  },

  initPage: function () {
    this.getMoneyList();
  },

  getdata: function (server, method, data) {
    var that = this; 
    var ProtocolData = JSON.parse(data);
    if(typeof server == 'string'){
      switch(method){
        case constants.GET_CASHGIFT_LIST:
          that.getMoneyData(ProtocolData);
          break;
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.wedding_id);
    this.setData({
      Card_Id: options.wedding_id
    })
    this.getMoneyList();
    controller.init(this.initPage, this.getdata,)
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