
var sq = require('../../utils/sRequest.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groom_avater: '',                   // 新郎头像
    bride_avater: '',                   // 新娘头像
    bride_name: '',
    groom_name:'',
    Card_Id: null
  },

  //选择并上传新郎头像
  choosegroomImage: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album","camera"],
      success: function (res) {
        console.log(res.tempFilePaths);
        sq.Upload({
          type:1,
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
          type:1,
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
   * 获取新娘姓名
  */
  getBirdeName: function (e) {
    this.setData({
      bride_name: e.detail.value
    })
  },
  
  /**
   * 获取新郎姓名
  */
  getGroomName: function (e) {
    this.setData({
      groom_name: e.detail.value
    })
  },

  /**
   * 保存数据到上个页面
  */
  saveData: function () {
    var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];
    var prevPage = pages[pages.length - 2];              // 获取上一个页面信息
    if(this.data.bride_avater == ''){
      this.data.bride_avater = app.globalData.default_avatar;
    } 
    if(this.data.groom_avater == ''){
      this.data.groom_avater = app.globalData.default_avatar;
    }
    prevPage.setData({
      groom_avater: this.data.groom_avater,
      bride_avater: this.data.bride_avater, 
      bride_name: this.data.bride_name,
      groom_name: this.data.groom_name,
    })
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      groom_avater: options.groom_avater,
      bride_avater: options.bride_avater, 
      bride_name: options.bride_name,
      groom_name: options.groom_name,
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
    this.saveData();
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