var constants = require('../../../static/ProtocolType.js');
var controller = require('../../../utils/controller_onec.js');

var currentPage = 1;

Page({

  /**
   * 页面的初始数据 
   */
  data: {
    Card_Id:null,
    attend_list: [],
    pending_list: [],
    absence_list: [],
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    lahei:['拉黑']
  },

  /**
   * 滑动切换tab
  */
  bindChange: function (e) {
    var that = this;
    currentPage = parseInt(e.detail.current) + 1;
    that.getstatisticList(currentPage);
    that.setData({
      currentTab: e.detail.current
    })
  },

  /**
   * 点击tab切换
  */
  swichNav: function (e) {
    console.log(e.target.dataset.current);
    var that = this;
    currentPage = parseInt(e.target.dataset.current) + 1 ;
    if(this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
      that.getstatisticList(currentPage);
    }
  },

  /**
   * 改变用户状态
  */
  changestatus: function(e) {
    console.log(e.detail.current);
  },
  
  /**
   * 获取统计列表
  */
  getstatisticList: function (val) {
    var that = this;

    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_GUEST_STATISTICS,
      data:{
        action_name:'get_guest_statistics',
        data:{
          card_id: that.data.Card_Id,
          type: val,              //回执类型， 1：出席 2：待定 3：有事
        }
      }
    })
  },

  getStatisticData: function (data) {
    var that = this;
    console.log('currentPage=' + currentPage);
    if(data.code == 0){
      if(currentPage == 1){
        that.setData({
          attend_list: data.data
        })
      } else if (currentPage == 2){
        that.setData({
          pending_list: data.data
        })
      } else {
        that.setData({
          absence_list: data.data
        })
      }
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }
  },

  /**
   * 页面请求初始化
  */
  initPage: function () {
    this.getstatisticList(currentPage);
  },

  /**
   * 获取数据
  */
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch (method){
        case constants.GET_GUEST_STATISTICS:
          that.getStatisticData(ProtocolData);
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
    var that = this;
    that.data.Card_Id = options.wedding_id;
    that.getstatisticList(currentPage);
    controller.init(that.initPage, that.getdata,);
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          winWidth:res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
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