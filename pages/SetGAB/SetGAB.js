
var sq = require('../../utils/sRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groom_avater: '',                   // 新郎头像
    bride_avater: ''                    // 新娘头像
  },

  //选择并上传新郎头像
  choosegroomImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album","camera"],
      success: function (res) {
        sq.Upload({
          filePaths: res.tempFilePaths,
          success: function (res) {
            that.setData({
              groom_avater: res.imageURL
            })
          }
        })
      }
    })
  },

  //选择并上传新娘头像
  choosebrideImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album","camera"],
      success: function (res) {
        sq.Upload({
          filePaths: res.tempFilePaths,
          success: function (res) {
            that.setData({
              bride_avater: res.imageURL
            })
          }
        })
      }
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