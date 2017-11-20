// pages/SetGuest/SetGuest.js
var constants = require('../../static/ProtocolType.js');
var controller = require('../../utils/controller_onec.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:['出席','待定','有事'],
    Card_ID: null,
    currentValue: 0,
    wish: '',
    name: '',
    phone: '',
    people_num: 0
  },

  getname: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  getphone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  getpeopleNum: function (e) {
    this.setData({
      people_num: e.detail.value
    })
  },

  /**
   * 修改宾客出席状态
  */
  bindPickerChange: function (e) {
    console.log(e);
    console.log(this.data.status[e.detail.value]);
    var that = this;
    var current = that.data.status[e.detail.value];
    that.setData({
      currentStatus: current,
      currentValue: parseInt(e.detail.value)
    })
  },

  saveGuestInfo: function () {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.UPDATE_GUEST_INFO,
      data:{
        action_name: 'update_guest_info',
        data:{
          user_id: app.globalData.userInfo.id,
          wedding_id: that.data.Card_ID,
          name: that.data.name,
          phone: that.data.phone,
          status: parseInt(that.data.currentValue)+1,
          num: parseInt(that.data.people_num),
          wish: that.data.wish
        }
      }
    })
  },

  getUpdate: function (data) {
    if(data.code == 0){
      wx.showToast({
        title: '修改成功',
        duration: 2000
      })
      wx.navigateBack({
        detail: 1
      })
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }
  },


  /**
   * 跳转到修改祝福页面
  */
  toUpdateWish: function () {
    wx.navigateTo({
      url:'./updateWish/updatewish?wish='+ this.data.wish,
    })
  },

  getGeuestInfo: function () {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_GUEST_BACK,
      data:{
        action_name: 'get_guest_back',
        data:{
          user_id: parseInt(app.globalData.userInfo.id),
          wedding_id: that.data.Card_ID
        }
      }
    })
  },

  //获取到的数据
  getGuestData: function (data) {
    console.log(data);
    if(data.code == 0){
      this.setData({
        wish: data.data.wish,
        currentValue: parseInt(data.data.status)-1,
        people_num: data.data.people_num,
        name: data.data.name,
        phone: data.data.phone
      })
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }
  },

  /**
   * 初始化页面请求
  */
  initPage: function () {
    this.getGeuestInfo()
  },

  /**
   * 获取信道返回数据
  */
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch (method){
        case constants.GET_GUEST_BACK:
          that.getGuestData(ProtocolData);
          break;
        case constants.UPDATE_GUEST_INFO:
          that.getUpdate(ProtocolData);
      }
    } else {
      console.log(server);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.Card_ID = parseInt(options.wedding_id);
    this.getGeuestInfo();
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