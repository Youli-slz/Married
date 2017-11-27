var constants = require('../../../static/ProtocolType.js');
var controller = require('../../../utils/controller_onec.js');
var currentPage = 1;
var current_template=1;
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    card_type_list: [],
    Card_list: [],
    CardListData: [],
    currentTab:0,
    winWidth: 0,
    winHeight: 0,
    methodType: [{
      id: 0,
      name: '预览'
    },{
      id:1,
      name: '创建'
    }],
    wedding_id: null
  },

  /**
   * 滑动切换tab
  */
  bindChange: function (e) {
    var that = this;
    currentPage = parseInt(e.detail.current) + 1;
    that.setData({
      currentTab: e.detail.current
    })
  },

  /**
   * 点击tab切换
  */
  swichNav: function (e) {
    var that = this;
    currentPage = parseInt(e.target.dataset.current) + 1 ;
    if(this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  /**
   * 获取请帖类别
  */
  getCardType: function () {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_CARD_TEMPLATE_STYLE,
      data:{
        action_name:'get_card_template_style',
        data:'get_card_template_style'
      }
    })
  },

  /**
   * 获取请帖数据
  */
  getTypeData:function (data){
    console.log(data);
    if(data.code == 0){
      console.log(data.data);
      this.setData({
        card_type_list: data.data,
      })
    } else {
      console.log(data.msg);
    }
  },

  /**
   *请求推荐类别的请帖模版
  */
  getrecommendList: function () {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_CARD_TEMPLATE_LIST,
      data:{
        action_name: 'get_card_template_list',
        data:{
          page_no: current_template,
          page_size: 20,
          group_id: 1
        }
      }
    })
  },

  /**
   * 获取推荐类别的数据
  */
  getRecommecdData: function (data) {
    var that = this;
    if(data.code == 0){
      console.log(data.data)
      if(data.data.length){
        for(var i = 0; i< data.data.length; i++){
          that.data.Card_list.push(data.data[i]);
        }
      }
      that.setData({
        CardListData: data.data,
        Card_list: that.data.Card_list
      })
    } else {
      wx.showToast({
        title: data.msg,
        image: '../../../assets/image/cuo.png',
        duration: 2000
      })
    }
  },

  /**
   * 下拉到底部获取新的数据
  */
  lower: function () {
    if(this.data.CardListData.length >= 20){
      current_template++;
      this.getrecommendList();
    }
  },

  /**
   * 选择操作
  */
  make_card: function (e) {
    var that = this;
    var card_id = e.currentTarget.dataset.id;
    if(that.data.methodType[e.detail.value].name == '预览'){
      console.log('预览')
      console.log(e.currentTarget.dataset.link);
      wx.navigateTo({
        url: '../../ToCard/tocard?templateId='+ card_id +'&type=1' 
      })
    } else {
      console.log('创建')
      wx.navigateTo({ 
        url:'../SetingCard/setting_card?card_id='+card_id + '&wedding_id=' + parseInt(that.data.wedding_id)
      })
    }

  },

  /**
   * 创建请帖请求
  */
  createCard: function (val) {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.CREATE_CARD_TEMPLATE,
      data:{
        action_name: 'create_card_template',
        data:{
          wedding_id: parseInt(that.data.wedding_id),
          user_id: parseInt(app.globalData.userInfo.id),
          template_id: parseInt(val)
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

  /**
   * 页面请求初始化
  */
  initPage: function () {
    this.getCardType();
    this.getrecommendList();
  },

  /**
   * 获取数据
  */
  getdata: function (server, method, data) {
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch(method){
        case constants.GET_CARD_TEMPLATE_STYLE:
          that.getTypeData(ProtocolData);
          break;
        case constants.GET_CARD_TEMPLATE_LIST:
          that.getRecommecdData(ProtocolData);
          break;
        case constants.CREATE_CARD_TEMPLATE:
          that.getCreateData(ProtocolData);
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
    console.log('请帖id   '+ options.wedding_id)
    var that = this;
    that.getCardType();
    that.getrecommendList();
    controller.init(that.initPage, that.getdata,);
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          wedding_id: options.wedding_id
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