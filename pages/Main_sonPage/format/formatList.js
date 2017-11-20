// pages/Main_sonPage/format/formatList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: null,
    windowWidth: null,
    currentTab: 0
  },

  /**
   * 获取设备信息
  */
  getwinowInfo: function (){
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight 
        });
      }
    })
  },

  /**
   * 切换到上一页
  */
  uppage: function () {
    var that = this;
    if(that.data.currentTab == 0){
      return false;
    } else {
      that.setData({
        currentTab: that.data.currentTab - 1
      })
    }
  },

  /**
   * 切换到下一页
  */
  downpage: function () {
    var that = this;
    if(that.data.currentTab == 3){
      return false;
    } else {
      that.setData({
        currentTab: that.data.currentTab + 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getwinowInfo();
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