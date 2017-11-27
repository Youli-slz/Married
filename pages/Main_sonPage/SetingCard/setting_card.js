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
var imgStr = '';


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
      fontSize: 30,
      CanvasText: '',
      TimeImg: '',
      SiteImg: '',
      wedding_id: null,
      card_id: null,
      link: '',
      winWidth: null,
      winHeight: null,
      ImgObject: []
      
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
      }　
    })
  },

  getBrideName: function (e) {
    this.setData({
      Bride: e.detail.value,
    })
    this.canvass('bride', e.detail.value)
  },

  getGroomName: function (e) {
    this.setData({
      Groom: e.detail.value,
    })
    this.canvass('groom', e.detail.value)
  },

  bindDateChange: function (e) {
    var TimeFull = '';
    if(this.data.weddingTime){
      TimeFull = this.format(e.detail.value) + this.format(this.data.weddingTime);
      this.canvass('time',TimeFull);
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
    var imgList = new Object();
    imgList.bride = this.data.BrideImg;
    imgList.groom = this.data.GroomImg;
    imgList.SiteImg = this.data.SiteImg;
    imgList.TimeImg = this.data.TimeImg;
    imgStr = JSON.stringify(imgList);
    this.createCard();
  },

  //获取裁剪成图片的文字
  getimg: function (type, value) {
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
              that.data.ImgObject.push
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
            console.log( type +val.imageURL);
          }
        })
      }
    })
  },


  canvass: function (type, value) {
    var that = this;
    var width = 0;
    var left = 0;
    if(type == 'time' || type == 'location'){
      this.data.fontSize = 15;
    } else {
      this.data.fontSize = 30;
    }
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
      console.log(data.data.template_id);
      wx.redirectTo({
        url: '../../ToCard/tocard?templateId='+ data.data.template_id + '&type=2'+ '&edit=1'+ '&userId=' +this.data.user_id + '&weddingId=' + this.data.wedding_id + '&imgStr=' + imgStr,
        success:function (res) {
          console.log(res);
        },
        fail: function (err) {
          console.log(err);
        }
      })
    }else {
      wx.showToast({
        title: data.msg,
        image: '../../../assets/image/cuo.png',
        duration: 2000
      })
    }
  },

  /**
   * 获取婚礼信息请求
  */
  getweddingInfo: function (weddingId) {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_INVITATION,
      data: {
        action_name: 'get_invitation',
        data:{
          card_id: weddingId,
        }
      }
    })
  },

  /**
   * 获取到婚礼的信息
  */
  getWeddingData: function (data) {
    var that = this;
    var Data = [];
    var info = data.data;
    if(data.code == 0){
      var TIME = that.convert_Time(info.wedding_time);
      var fulltime = that.format(TIME.day) + that.format(TIME.time);
      info.site = JSON.parse(info.site);
      that.setData({
        Groom: info.bridegroom,
        Bride: info.bride,
        weddingDate: TIME.day,
        weddingTime: TIME.time,
        address: info.site
      })
      Data.push({type: 'groom', value: info.bridegroom});
      Data.push({type: 'bride', value: info.bride});
      Data.push({type: 'time', value: fulltime});
      Data.push({type: 'location', value: info.site.name})
      console.log(Data)
        // that.canvass(Data[i])
        var count = 0;
        var te = setInterval(function () {
          if(count < 4){
           that.canvass(Data[count].type, Data[count].value);
           count ++;
          } else {
            clearInterval(te);
            console.log('关闭定时器')
          }

        },200);
    }
  },

  convert_Time: function (t) {
    var obj = {day: '', time: ''};
    var date = new Date(t*1000);
    var year = date.getFullYear();
    var month = this.addZero(date.getMonth()+ 1);
    var day = this.addZero(date.getDate());
    var hour = this.addZero(date.getHours());
    var minute = this.addZero(date.getMinutes());

    obj.day = year + '-' + month + '-' + day;
    obj.time = hour + ':' + minute;

    return obj;
  },

  addZero: function (temp){
    if(temp < 10)
      return '0'+temp;
    else 
      return temp;
  },

  initPage: function () {
    this.createCard();
    this.getweddingInfo();
  },

  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch(method){
        case constants.CREATE_CARD_TEMPLATE:
          that.getCreateData(ProtocolData);
          break;
        case constants.GET_INVITATION:
          that.getWeddingData(ProtocolData);
          break;
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('请帖id   '+ options.wedding_id)
    var that = this;
    controller.init(that.initPage, that.getdata,)
    that.getweddingInfo(options.card_id);
    ctx=wx.createCanvasContext('myCanvas');
    console.log(options);
    this.setData({
      wedding_id: options.wedding_id,
      user_id: app.globalData.userInfo.id,
      card_id: options.card_id,
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