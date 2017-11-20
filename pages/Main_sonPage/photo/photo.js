var sq = require('../../../utils/sRequest.js');
var constants = require('../../../static/ProtocolType.js');
var controller = require('../../../utils/controller_onec.js');
// var page_num = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page_num: 1,
    chooseMethod: [
      '图片',
      '视频'
    ],
    ischange: false,
    doommList: [
    ],
    isdelect: false,
    isselect: false,
    num: 2,
    photoList: [],                 // 显示到页面的相册列表
    selectIndex: [],              // 选择的图片的 index
    selectNum: 0,                 // 选中照片数
    wedding_id: null,             // 婚礼id
  },

  //选择图片获取视频上传
  bindPickerChange: function (e) {
    this.data.doommList = [];
    var value = e.detail.value;
    if (value == 0) {
      this.AddImage();
    } else {
      this.AddVideo();
    }
  },
  
  // 添加照片
  AddImage: function () {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        sq.Upload({
          type: 1,
          filePaths: res.tempFilePaths,
          success: function (res) {
            that.data.doommList.push({ type: 1, url: res.imageURL, Num: 2 });
            that.data.photoList.push({ type: 1, url: res.imageURL, Num: 2 });
            that.setData({
              photoList: that.data.photoList,
              ischange: true,
            })
          }
        })
      }
    });
  },

  //添加视频
  AddVideo: function () {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        sq.Upload({
          type: 2,
          filePaths: res.tempFilePath,
          success: function (res) {

            that.data.doommList.push({ type: 2, url: res.imageURL, Num: 2 });
            that.data.photoList.push({ type: 2, url: res.imageURL, Num: 2 });
            that.setData({
              photoList: that.data.photoList,
              ischange: true,
            })
          }
        })
      }
    })
  },

  //保存图片和视频
  saveImage: function () {
    var that = this;
    // var simage = [];
    console.log(that.data.doommList)
    for (var i = 0; i < that.data.doommList.length; i++) {
      delete that.data.doommList[i].Num;
    }
    controller.REQUEST({
      servername: constants.IMAGE_SERVER_NAME,
      methodname: constants.SET_PHOTO_ALBUM,
      data: {
        action_name: "set_photo_album",
        data: {
          card_id: parseInt(that.data.wedding_id),
          url: that.data.doommList,
        }
      }
    })
  },

  //保存图片和视频后的数据
  getSaveImageData: function (data) {
    var that = this;
    if(data.code == 0){
      that.data.photoList = [];
      that.data.page_num = 1;
      that.getImgVi();
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      });
      that.setData({
        ischange: false
      })
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }
  },

  //修改删除状态
  changeDelect: function () {
    var that = this;

    for (var i = 0; i < that.data.photoList.length; i++) {
      that.data.photoList[i].Num = 2;
    }

    that.setData({
      isdelect: !that.data.isdelect,
      photoList: that.data.photoList,
      selectIndex: [],
      selectNum: 0,
    });
  },

  //删除事件
  Photo_delete: function () {
    var that = this;
    // console.log(this.data.selectIndex);
    controller.REQUEST({
      servername: constants.IMAGE_SERVER_NAME,
      methodname: constants.DEL_PHOTO_ALBUM,
      data: {
        action_name: "del_photo_album",
        data: {
           id: that.data.selectIndex,
        }
      }
    })
  },

  //删除事件返回的数据
  getDeleteData:function (data) {
    var that = this;
    if(data.code == 0){
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      })
      that.setData({
        isdelect: !that.data.isdelect,
        photoList: [],
        selectIndex: [],
        selectNum: 0,
      });
      that.data.page_num = 1;
      that.getImgVi();
    } else (
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    )
  },

  //选择照片事件
  select: function (e) {
    console.log(e.currentTarget.dataset.id)
    var INDEX = e.currentTarget.dataset.index;
    var ID = e.currentTarget.dataset.id;
    if (this.data.photoList[INDEX].Num == 2) {
      var param = {};
      var string = "photoList[" + INDEX + "].Num";
      param[string] = 1;
      this.setData(param);
      this.data.selectIndex.push(ID);
    } else {
      var param = {};
      var string = "photoList[" + INDEX + "].Num";
      param[string] = 2;
      this.setData(param);
      for (var i = 0; i < this.data.selectIndex.length; i++) {
        if (this.data.selectIndex[i] == ID) {
          this.data.selectIndex.splice(i, 1);
        }
      }
    }
    this.setData({
      selectNum: this.data.selectIndex.length,
    })
  },

  // 封装获取的相册列表
  getList: function (List) {
    // console.log(this.data.doommList)
    if(List[List.length-1] == this.data.photoList[this.data.photoList.length - 1]){
      return false;
    } else {
      for (var i = 0; i < List.length; i++) {
        this.data.photoList.push({id: List[i].id, type: List[i].type, url: List[i].url, Num: 2 })
      }
    }
    this.setData({
      photoList: this.data.photoList,
    })
  },

  //初始化页面获取图片视频列表
  getImgVi: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    controller.REQUEST({
      servername: constants.IMAGE_SERVER_NAME,
      methodname: constants.GET_PHOTO_LIST,
      data:{
        action_name: "get_photo_list",
        data: {
          wedding_id: that.data.wedding_id,
          page_no: that.data.page_num,
          page_size: 20
        }
      }
    })
  },

  //获取图片视屏列表
  getImgViData: function (data) {
    var that = this;
    console.log(data.data.length)
    if (data.code == 0){
      if(data.data.length >= 20){
        that.getList(data.data);
      } else if (data.data.length > 0) {
        that.data.page_num = 0;
        that.getList(data.data);
      } else {
        that.data.page_num = 0;
      }
    }else {
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }
    wx.hideLoading();
  },

  //图片预览
  preview: function (e) {
    var imagelist = []
    for(var i = 0; i < this.data.photoList.length; i++){
      if(this.data.photoList[i].type == '1'){
        imagelist.push(this.data.photoList[i].url)
      }
    }
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: imagelist,
    })
  },


  //删除保存前的图片
  delbeforesave: function (e) {
    var ischange;
    var index = e.currentTarget.dataset.index;
    var that = this;
    for(var i = 0; i< that.data.doommList.length; i++){
      if(that.data.photoList[index].url == that.data.doommList[i].url){
        that.data.doommList.splice(i,1);
      }
    }
    if(that.data.doommList.length == 0){
      ischange = false;
    } else {
      ischange = true;
    }
    // that.data.doommList.splice(index,1);
    that.data.photoList.splice(index,1);
    that.setData({
      photoList: that.data.photoList,
      doommList: that.data.doommList,
      ischange: ischange
    })
  },

  /**
   * 初始化页面请求
  */
  initPage: function () {
    this.getImgVi();
  },

  /**
   * 获取信道请求数据
  */
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch (method){
        case constants.SET_PHOTO_ALBUM:
          that.getSaveImageData(ProtocolData);
          break;
        case constants.DEL_PHOTO_ALBUM:
          that.getDeleteData(ProtocolData);
          break;
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
    this.data.wedding_id = options.wedding_id;
    this.getImgVi();
    controller.init(this.initPage, this.getdata,);
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
    // this.setData({
    //   photoList : [],
    //   page_num: 1
    // })
    // console.log('onload')
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

    if(this.data.page_num != 0){
      this.data.page_num ++;
      this.getImgVi()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})