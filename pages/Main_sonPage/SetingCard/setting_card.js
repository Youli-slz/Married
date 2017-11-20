// pages/Main_sonPage/SetingCard/setting_card.js
var sq=require('../../../utils/sRequest.js');
var constants = require('../../../static/ProtocolType.js');
var controller = require('../../../utils/controller_onec.js');
var ctx;
var app = getApp();
var picwidth = 0;
var length;
var UI_WIDTH = 750;
var UI_HEIGHT = 1120;


Page({

  /**
   * 页面的初始数据
   */
  data: {
      address: null,
      latitude: null,
      longitude: null,
      Bride: '',
      BrideImg:'',      // 获取新娘名字的图片
      GroomImg:'',      // 获取新郎名字的图片
      Groom: '',
      weddingDate: '',
      weddingTime: '',
      imgUrl: '',
      width: null,
      height: null,
      fontSize: 15,
      CanvasText: '',
      TimeImg: '',
      SiteImg: '',
      wedding_id: null,
      card_id: null,
      link: '',
      winWidth: null,
      winHeight: null
      
  },

  getAddr: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        var address = {name: res.name, address: res.address};
        that.setData({
          address: address,
          latitude: res.latitude,
          longitde: res.longitude
        });
        that.canvass('site', address.name)
        // that.getimg('site', address.name);
      }　
    })
  },

  getBrideName: function (e) {
    this.setData({
      Bride: e.detail.value,
    })
    this.canvass('bride', e.detail.value)
    // this.getimg('bride', e.detail.value)
  },

  getGroomName: function (e) {
    this.setData({
      Groom: e.detail.value,
    })
    this.canvass('groom', e.detail.value)
    // this.getimg('groom', e.detail.value)
  },

  bindDateChange: function (e) {
    var TimeFull = '';
    if(this.data.weddingTime){
      TimeFull = this.format(e.detail.value) + this.format(this.data.weddingTime);
      this.canvass('time',TimeFull);
      // this.getimg('time', TimeFull)
    }
    this.setData({
      weddingDate: e.detail.value,
    })
  },
  bindTimeChange: function (e) {
    var that = this;
    var TimeFull = '';

    if(this.data.weddingDate){
      TimeFull = this.format(that.data.weddingDate) + this.format(e.detail.value);
      // this.getimg('time', TimeFull)
      that.canvass('time', TimeFull)
    }
    that.setData({
      weddingTime: e.detail.value,
    })
  },

  //格式化时间
  format: function (t) {
    var arr;
    var isyear = t.indexOf('-');
    if(isyear > -1){
      arr = t.split('-');
      return arr[0]+ '年' + arr[1] + '月' + arr[2] + '日'
    } else{
      arr= t.split(':');
      return arr[0] + '时' + arr[1] + '分'
    }
  },

  updateImg: function () {
    if(this.data.BrideImg == '' || this.data.GroomImg== '' || this.data.SiteImg == '' || this.data.TimeImg == ''){
      wx.showToast({
        title: '请填写完整信息',
        image: '../../../assets/image/cuo.png',
        duration: 2000
      })
      return false;
    }
    this.createCard();
    console.log(this.data.BrideImg);
    console.log(this.data.GroomImg);
    console.log(this.data.SiteImg);
    console.log(this.data.TimeImg);
    console.log(this.data.card_id);
    console.log(this.data.link)

    wx.redirectTo({
      url: '../../test/test?card_id='+ this.data.card_id + '&edit=1'+'&bride='+ this.data.BrideImg+'&groom='+ this.data.GroomImg+'&site='+ this.data.SiteImg+'&time='+ this.data.TimeImg+'&preview_link=' + this.data.link,

    })
    // var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];
    // var prevPage = pages[pages.length - 2];
    // prevPage.setData({
    //   webSrc: 'https://logic.hunlibaoapp.com/wedding/wedding.html?card_id=NzE0Njk4N2ZpcmVfY2xvdWQ&with_myb=1&type=app&edit=1&message=helloworld'
    // })

    // wx.switchTab({
    //   url: '../../test/test'
    // })
  },

  //获取裁剪成图片的文字
  getimg: function (type , value) {
    var that = this; 

    wx.canvasToTempFilePath({
      x:0,
      y: that.data.fontSize*0.15,
      height: that.data.fontSize*1.2,
      width: length,
      canvasId: 'myCanvas',
      success: function (res) {
        var img = [res.tempFilePath];
        sq.Upload({
          type: 1,
          filePaths: img,
          success: function (val) {
            console.log(val.imageURL)
            if(type == 'bride'){
              that.setData({
                BrideImg: val.imageURL,
                // width: width,
                // height: that.data.fontSize
              })
            } else if( type == 'groom'){
              that.setData({
                GroomImg: val.imageURL,
                // width: width,
                // height: that.data.fontSize
              })
            } else if( type == 'time'){
              that.setData({
                TimeImg: val.imageURL,
                // width: width,
                // height: that.data.fontSize
              })
            } else{
              that.setData({
                SiteImg: val.imageURL,
                // width: width,
                // height: that.data.fontSize
              })
            } 
            console.log('type:' +val.imageURL);
          }
        })
      }
    })
  },


  canvass: function (type, value) {
    var that = this;
    var width = 0;
    var left = 0;
    var arr = value.split('');
    for(var i = 0; i < arr.length; i++){
      if (/^[a-zA-Z]$/.test(arr[i])){
        width = width + that.data.fontSize*0.47;
      } else if (/^[0-9]$/.test(arr[i]) ){
        width = width + that.data.fontSize*0.6;
      } else if (/^[\u4E00-\u9FA5]$/.test(arr[i])){
        width = width + that.data.fontSize;
      }
    } 

    if(type == 'groom'){
      length = 320/UI_WIDTH *that.data.winWidth
      left = 320/UI_WIDTH * that.data.winWidth - width;
    } else if (type == 'bride'){
      length = 320/UI_WIDTH *that.data.winWidth
      left = 0;
    } else if(type == 'time'){
      length = 406/UI_WIDTH * that.data.winWidth
      left = (length-width)/2
    } else if(type == 'location'){
      length = 486/UI_WIDTH * that.data.winWidth;
      left = (length-width)/2
    }
    ctx.setFontSize(that.data.fontSize);
    ctx.fillText(value, left, that.data.fontSize);
    ctx.draw();
    this.getimg(type, value)
  },

  /**
   * 创建请帖请求
  */
  createCard: function () {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.CREATE_CARD_TEMPLATE,
      data:{
        action_name: 'create_card_template',
        data:{
          wedding_id: parseInt(that.data.wedding_id),
          user_id: app.globalData.userInfo.id,
          template_id: parseInt(that.data.card_id)
        }
      }
    })
  },

  /**
   * 请求创建获取的数据
  */
  getCreateData: function (data){
    if(data.code == 0){
      console.log(data.data);
    }else {
      wx.showToast({
        title: data.msg,
        image: '../../../assets/image/cuo.png',
        duration: 2000
      })
    }
  },

  initPage: function () {
    this.createCard();
  },

  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch(method){
        case constants.CREATE_CARD_TEMPLATE:
          that.getCreateData(ProtocolData);
          break;
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    controller.init(that.initPage, that.getdata,)
    
    ctx=wx.createCanvasContext('myCanvas');
    console.log(options);
    this.setData({
      wedding_id: options.wedding_id,
      user_id: app.globalData.userInfo.id,
      card_id: options.card_id,
      link: options.preview_link
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
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