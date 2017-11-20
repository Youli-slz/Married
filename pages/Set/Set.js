var constants = require('../../static/ProtocolType.js');
var controller = require('../../utils/controller_onec.js');
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
    weddingDate: '',
    weddingTime: '',
    mobile: '',
    address: null,
    cover: '',
    Card_Id:null,
    weddingInfo:null,
    latitude: '',
    longitude:'',
    banquet_hall:''
  },

    /**
   * 从地图上选择地址
  */
  getAddr: function(){
    var that = this;
    wx.chooseLocation({
      success: function(res){
        var addresss = {name: res.name, address: res.address};
        that.setData({
          address : addresss,
          latitude: res.latitude,
          longitude: res.longitude
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
          type: 1,
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
  getbanquet_hall: function (e) {
    this.setData({
      banquet_hall: e.detail.value
    })
  },
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
    console.log(e);
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
      url: '../SetGAB/SetGAB?groom_avater=' + this.data.groom_avater +'&groom_name='+ this.data.groom_name + '&bride_avater='+ this.data.bride_avater + '&bride_name=' +this.data.bride_name  
    })
  },

  getWeddingInfo: function (val) {
    var that = this;

    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_INVITATION,
      data:{
        action_name:'get_invitation',
        data:{
          card_id: val
        }
      }
    })
  },

  /**
   * 获取婚礼信息
  */
  getWeddingData: function (data) {
    var that = this;
    if(data.code == 0){
      var info = data.data;
        info.wedding_time = that.convert_Time(info.wedding_time);
        that.setData({
          weddingInfo: info,
          cover: info.pic,
          weddingDate: info.wedding_time.day,
          weddingTime: info.wedding_time.time,
          address: JSON.parse(info.site),
          groom_avater: info.bridegroom_pic,
          groom_name: info.bridegroom,
          bride_avater: info.bride_pic,
          bride_name: info.bride,
          mobile: info.phone,
          latitude: info.latitude,
          longitude: info.longitude,
          banquet_hall: info.banquet_hall
        })     
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }
  },

  /**
   * 时间戳转换
  */
  convert_Time: function (t) {
    var obj={day:'',time: '', week:''};
    var week;
    var date = new Date(t * 1000);
    var year = date.getFullYear();
    var month = this.addZero(date.getMonth() + 1);
    var day = this.addZero(date.getDate());
    var hour = this.addZero(date.getHours());
    var minute = this.addZero(date.getMinutes());
    switch (date.getDay()){
      case 0: week='星期天'; break;
      case 1: week = '星期一'; break;
      case 2: week = '星期二'; break;
      case 3: week = '星期三'; break;
      case 4: week = '星期四'; break;
      case 5: week = '星期五'; break;
      case 6: week = '星期六'; break;
    }
    obj.day = year + '-' + month + '-' + day;
    obj.time = hour + ':' + minute;
    obj.week = week;

    return obj;
  },

  addZero: function (temp) {
    if(temp < 10)
      return "0"+temp;
    else 
      return temp;
  },

  /**
   * 更新数据
  */
  saveWeddingInfo: function () {
    var that = this;
    console.log(this.data.weddingDate);
    console.log(this.data.weddingTime);
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.UPDATE_INVITATION,
      data:{
        action_name: 'update_invitation',
        data:{
          card_id: this.data.Card_Id,
          bride: this.data.bride_name,
          bridegroom: this.data.groom_name,
          bride_pic: this.data.bride_avater,
          bridegroom_pic: this.data.groom_avater,
          phone: this.data.mobile,
          site: JSON.stringify(this.data.address),
          wedding_time: this.data.weddingDate + " " + this.data.weddingTime,
          latitude: this.data.latitude,
          longitude: this.data.longitude,
          pic: this.data.cover,
          banquet_hall: this.data.banquet_hall
        }
      },
      success: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 获取更新后的信息
  */
  UpdataWeddingData: function (data) {
    if(data.code == 0){
      wx.showToast({
        title: '修改成功',
        duration: 2000
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }    
  },

  //初始化页面请求
  initPage: function () {
    this.getWeddingInfo(this.data.Card_Id);
  },

  //获取信道数据
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch(method){
        case constants.GET_INVITATION:
          that.getWeddingData(ProtocolData);
          break;
        case constants.UPDATE_INVITATION:
          that.UpdataWeddingData(ProtocolData);
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
    console.log(options);
    this.getWeddingInfo(options.wedding_id);
    this.setData({
      Card_Id: options.wedding_id
    });
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