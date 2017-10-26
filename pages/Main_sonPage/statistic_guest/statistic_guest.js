var sq = require('../../../utils/sRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    that.setData({
      currentTab: e.detail.current
    })
  },

  /**
   * 点击tab切换
  */
  swichNav: function (e) {
    var that = this;
    if(this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
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
  getstatisticList: function () {
    sq.POST({
      url:'/socket/response.do',
      servername: 'logic',
      params:{
        action_name:'get_guest_statistics',
        data:{
          card_id: 18
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getstatisticList();
    wx.getSystemInfo({
      success: function (res) {
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