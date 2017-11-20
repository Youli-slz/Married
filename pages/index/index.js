
var constants = require('../../static/ProtocolType.js');
var controller = require('../../utils/controller_onec.js');
var app = getApp();
var TIME = null;
var countdown_time;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    other_count: 0,
    my_invitation: [],
    other_invitation: [],
    hSwiperVar: {},
    IsmyCard: true
  },

  /**
   * 点击地址打开指定地点的地址
  */
  toMap: function (e) {
    wx.openLocation({
      latitude: parseFloat(e.currentTarget.dataset.latitude),
      longitude: parseFloat(e.currentTarget.dataset.longitude),
      scale: 18
    })
  },

  //获取我的婚礼列表
  getMywedding: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      // mask: true
    })
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_INVITATION_LIST,
      data:{
        action_name: 'get_invitation_list',
        data:{
          user_id: app.globalData.userInfo.id,
        }
      }
    })
  },

  getInvitationList: function (data) {
    var that = this;
    wx.hideLoading();
    console.log(data.other_invitation.list)
    for(var i = 0; i< data.other_invitation.count; i++){
      data.other_invitation.list[i].site = JSON.parse(data.other_invitation.list[i].site)
      console.log(data.other_invitation.list[i].site);
    }
    that.setData({
      my_invitation: data.my_invitation,
      other_invitation: data.other_invitation.list,
      other_count: data.other_invitation.count
    })
    for(var i = 0; i< data.my_invitation.length; i++){
      console.log('shijain')
      that.countdown(data.my_invitation[i].time, i);
    }
  },



  /**
   * 跳转到主页面
  */
  toMain: function (e) {
    // wx.setStorage({
    //   key: 'USER_ROLE_WEDDING',
    //   data: e.currentTarget.dataset.user_status,
    // })
    wx.navigateTo({
      url: '../Main/Main?wedding_id=' + e.currentTarget.dataset.card_id
      + '&wedding_time=' + e.currentTarget.dataset.wedding_time
      + '&site=' + e.currentTarget.dataset.site
      + '&latitude=' + e.currentTarget.dataset.latitude
      + '&longitude=' + e.currentTarget.dataset.longitude
      + '&user_status=' + e.currentTarget.dataset.user_status,
    })
  },

  /**
   * 跳转到创建婚礼页面
  */
  goadd: function () {
    wx.navigateTo({
      url: '../createWedding/Create',
    })
  },

  countdown: function (time, index) {
    var that = this;
    var time = time;
    var index = index;
    var EndTime = time || [];
    var NowTime = parseInt(new Date().getTime() / 1000);
    var total_micro_second = EndTime - NowTime || [];
    // 渲染倒计时时钟
    var param = {};
    var string = "my_invitation[" + index + "].time"
    param[string] = that.dateformat(total_micro_second)
    that.setData(param);
    if (total_micro_second <= 0) {
      var param = {};
      var string = "my_invitation[" + index + "].time"
      param[string] = "已截止"
      that.setData(param);
      return ;
    }
    countdown_time = setTimeout(function () {
      total_micro_second -= 1000;
      that.countdown(time, index);
    }
      , 1000)
  },


  // 时间格式化输出，如11:03 25:19 每1s都会调用一次
  dateformat: function (micro_second) {
    // 总秒数
    var second = Math.floor(micro_second);
    // 天数
    var day = Math.floor(second / 3600 / 24);
    // 小时
    var hr = Math.floor(second / 3600 % 24);
    // 分钟
    var min = Math.floor(second / 60 % 60);
    // 秒
    var sec = Math.floor(second % 60);
    return day + "天" + hr + "小时" + min + "分钟" + sec + "秒";
  },

  //检测是否有userid
  getid: function (){
    var that = this;
    if(app.globalData.userInfo == null){
      TIME= setTimeout(function () {
        that.getid();
      },1000);
    } else {
      clearTimeout(TIME);

      that.getMywedding();
    }
  },

    getdata: function (server, method,  data) {
     var that = this;
     if(typeof server == 'string'){
      if(method == constants.GET_INVITATION_LIST){
        that.getInvitationList(JSON.parse(data).data);
      }
     } else {
       console.log(server)
     }
  },

    initPage: function () {
      var that = this;
      that.getid();
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
    // this.getMywedding();

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('show')
    // socket.initnetwork(this.getdata,);
    controller.init( this.initPage,this.getdata, );
    this.getid()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    for(var i= 0 ; i < this.data.my_invitation.length; i++){
      console.log(countdown_time)
      clearTimeout(countdown_time);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    for(var i= 0 ; i < this.data.my_invitation.length; i++){
      clearTimeout(countdown_time);
    }
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