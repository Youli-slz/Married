var sq = require('../../../utils/sRequest.js');
var constants = require('../../../static/ProtocolType.js');
var controller = require('../../../utils/controller_onec.js');
var page_num = 1

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Card_id:null,
    photoList:[]
  },

  /**
   * 获取图片视频列表
  */
  getImgVi: function (val) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    controller.REQUEST({
      servername: constants.IMAGE_SERVER_NAME,
      methodname: constants.GET_PHOTO_LIST,
      data:{
        action_name:'get_photo_list',
        data:{
          wedding_id: that.data.Card_Id,
          page_no: val,
          page_size: 20
        }
      }
    })
  },

  /**
   * 获取图片视频数据
  */
  getImgViData: function (data) {
    if(data.code == 0){
      if(data.data.length != 0){
        this.setData({
          photoList: data.data
        })
      } else {
        page_num = 0;
      }
    } else {
      if(page_num >1){
        page_num = page_num - 1;
      }
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }
    wx.hideLoading();
  },

  /**
   * 图片预览
  */
  preview: function (e) {
    var imagelist = [];
    for(var i=0; i< this.data.photoList.length; i++){
      if(this.data.photoList[i].type == "1"){
        imagelist.push(this.data.photoList[i].url)
      }
    }
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: imagelist
    })
  },

  /**
   * 初始化页面请求
  */
  initPage: function () {
    this.getImgVi(page_num);
  },

  /**
   * 获取信道请求的数据
  */
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch (method){
        case constants.GET_PHOTO_LIST:
          that.getImgViData(ProtocolData);
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
    this.data.Card_Id = options.wedding_id;
    this.getImgVi(page_num);
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
    page_num++;
    if(page_num != 0){
      this.getImgVi(page_num);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})