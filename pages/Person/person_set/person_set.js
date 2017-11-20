var constants = require('../../../static/ProtocolType.js');
var controller = require('../../../utils/controller_onec.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Name: '',
    Phone: ''
  },

  getName: function (e) {
    this.setData({
      Name: e.detail.value
    })
  },

  getPhone: function (e) {
    this.setData({
      Phone: e.detail.value
    })
  },

  savePersonInfo: function () {
    var that = this;
    if(that.data.Phone == '' || that.data.Name == ''){
      wx.showToast({
        title: '请填写完整信息',
        image: '../../../assets/image/cuo.png',
        duration: 2000
      })
    } else {
      controller.REQUEST({
        servername: constants.CONTANT_SERVER_NAME,
        methodname: constants.UPDATE_USER_INFO,
        data:{
          action_name: 'update_user_info',
          data:{
            user_id: app.globalData.userInfo.id,
            name: that.data.Name,
            phone: that.data.Phone
          }
        }
      })
    }

  },

  savePersonData: function (data) {
    if(data.code == 0){
      wx.showToast({
        title: '更新成功',
        duration: 2000
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000,
        image: '../../../assets/image/cuo.png'
      })
    }
  },

  initPage: function () {
    this.savePersonInfo();
  },

  getdata: function (server, method, data) {
    var that = this;
    var ProtocolData = JSON.parse(data);
    if(typeof server == 'string'){
      switch(method){
        case constants.UPDATE_USER_INFO:
          that.savePersonData(ProtocolData);
          break;
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      Name: options.name,
      Phone: options.phone
    })
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