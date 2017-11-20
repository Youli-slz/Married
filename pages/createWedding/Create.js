import { $WxToptips } from '../../components/wx';
import WxValidate from '../../utils/WxValidate.js';
var constants = require('../../static/ProtocolType.js');
var controller = require('../../utils/controller_onec.js');
var sq = require('../../utils/sRequest.js');
var Validate = "";
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    weddingDate: '',                 // 日期
    weddingTime: '',                 // 具体时间
    Groom: '',                       // 新郎名字
    Bride: '',                       // 新娘名字
    mobile: '',                      // 手机号
    address: null,                   // 婚礼地址
    submitStyle: 'submit_button',
    cover: '',                        // 封面图片url
    latitude: null,                   // 纬度
    longitude: null,                   // 经度
    banquet_hall: ''                   // 宴会厅
  },

  /**
   * 从地图上选择地址
  */
  getAddr: function(){
    var that = this;
    wx.chooseLocation({
      success: function(res){
        console.log(res);
        var addresss = {name: res.name, address: res.address};
        console.log(addresss);
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
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        console.log(res);
        sq.Upload({
          type: 1,
          filePaths: res.tempFilePaths,
          success: function (res) {
            that.setData({
              cover: res.imageURL
            })
          }
        })
      }
    });
  },

  /**
   * 从输入框获取
  */
  getBirdeName: function (e) {
    this.setData({
      Bride: e.detail.value
    })
  },
  getGroomName: function (e) {
    this.setData({
      Groom: e.detail.value
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
  getbanquet_hall: function (e) {
    this.setData({
      banquet_hall: e.detail.value
    })
  },
  bindDateChange: function (e) {
    console.log(e.detail.value);
    this.setData({
      weddingDate: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      weddingTime: e.detail.value
    })
  },


  showToptips(error) {
    const hideToptips = $WxToptips.show({
      timer: 3000,
      text: error.msg,
      className: 'weui-toptips-cancel',
      success: () => console.log('toptips', error)
    })
  },

  /**
   * 提交
  */
  onSubmit: function (e) {
    if (!Validate.checkForm(e)) {
      const error = Validate.errorList[0];
      // console.log(error);
      this.showToptips(error)
      return false;
    }
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.CREATE_INVITATION,
      data:{
        action_name: "create_invitation",
        data: {
          user_id: app.globalData.userInfo.id,
          bride: e.detail.value.Bride,
          bridegroom: e.detail.value.Groom,
          phone: e.detail.value.mobile,
          site: JSON.stringify(this.data.address),
          wedding_time: this.data.weddingDate +' '+ this.data.weddingTime,
          pic: this.data.cover,
          latitude: this.data.latitude,
          longitude: this.data.longitude,
          banquet_hall: this.data.banquet_hall
        }
      }
    })
    console.log(this.data.banquet_hall)
    wx.showLoading({
      title: '加载中...',
      duration: 2000,
      mask: true
    })
  },

  /**
   * 提交成功后显示成功信息
  */
  showSuccess: function (data) {
    if(data.code == 0){
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      });
      wx.hideLoading();
      wx.redirectTo({
        url: '../Main/Main?wedding_id='+ data.data.wedding_id + '&wedding_time=' + data.data.wedding_time + '&site=' + data.data.site + '&latitude=' + data.data.latitude + '&longitude=' + data.data.longitude,
      })
    }
  },

  /**
   * 获取数据方法
  */
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch (method){
        case constants.CREATE_INVITATION:
          that.showSuccess(ProtocolData);
          break;
      }
    }
  },

  /**
   * 创建页面时初始化请求方法
  */
  initPage: function() {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    controller.init(this.initPage, this.getdata,);
    //数据进行校验
    const rules = {
      Bride: {
        required: true,
      },
      Groom: {
        required: true,
      },
      mobile: {
        required: true,
        tel: true,
      },
      weddingDate: {
        required: true,
      },
      weddingTime: {
        required: true,
      },
      address: {
        required: true,
        minlength: 2,
      },
    }

    //验证字段的提示信息， 若不传则调用默认的信息
    const message = {
      Bride: {
        required: '请输入新娘姓名'
      },
      Groom: {
        required: '请输入新郎姓名'
      },
      mobile: {
        required: '请输入手机号',
        tel: '请输入正确的手机号',
      },
      weddingDate: {
        required: '请输入日期',
      },
      weddingTime: {
        required: '请输入时间'
      },
      address: {
        required: '请输入地址',
        minlength: '请输入正确地址'
      },

    }

    Validate = new WxValidate(rules, message)
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