var sq = require('../../utils/sRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weddingDate: '',
    weddingTime: '',
    mobile: '',
    address: '',
    cover: ''
  },

    /**
   * 从地图上选择地址
  */
  getAddr: function(){
    var that = this;
    wx.chooseLocation({
      success: function(res){
        that.setData({
        address : res.name + res.address
        });
      }
    })
  },

  /**
   * 选择封面图片
  */
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res){
        sq.Upload({
          filePaths: res.tempFilePaths,
          success:function (res) {
            console.log(res.imageURL);
            that.setData({
              cover: res.imageURL
            })
          }
        });
      }
    })
  },

  /**
   * 从输入框获取
  */
  getmobile: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  getaddress: function (e) {
    this.setData({
      address: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      weddingDate: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      weddingTime: e.detail.value
    })
  },

  //跳转到设置新郎新娘页面
  setGroomBride: function () {
    wx.navigateTo({
      url: '../SetGAB/SetGAB'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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