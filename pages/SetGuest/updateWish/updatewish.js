// pages/SetGuest/updateWish/updatewish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wish:''
  },

  getwish: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    console.log(e.detail.value.evaContent)
    prevPage.setData({
      wish: e.detail.value.evaContent,
    })
    wx.navigateBack({
      delta:1
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wish: options.wish
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