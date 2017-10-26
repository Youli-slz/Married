var sq = require('../../utils/sRequest.js');
// var login = require('../../utils/login.js');
var app = getApp();
var TIME = null;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    other_count: null,
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
      latitude: parseInt(e.currentTarget.dataset.latitude),
      longitude: parseInt(e.currentTarget.dataset.longitude),
      scale: 18
    })
  },

  //获取我的婚礼列表
  getMywedding: function () {
    var that = this;
    // try{
    //   var userid=wx.getStorageSync('USER_INFO');
    // } catch(e){

    // }
    sq.POST({
      url: '/socket/response.do',
      servername: "logic",
      params: {
        action_name: "get_invitation_list",
        data: {
          user_id: app.globalData.userInfo.id,
        }
      },
      success: function (res) {
        that.setData({
          my_invitation: res.my_invitation,
          other_invitation: res.other_invitation.list,
          other_count: res.other_invitation.count,
        })

        //暂时关闭倒计时
        for(var i = 0;  i < res.my_invitation.length; i++) {
            that.countdown(res.my_invitation[i].time, i);
        }
      }
    })
  },

  /**
   * 跳转到主页面
  */
  toMain: function (e) {
    wx.setStorage({
      key: 'USER_ROLE_WEDDING',
      data: e.currentTarget.dataset.user_status,
    })
    wx.navigateTo({
      url: '../Main/Main?wedding_id=' + e.currentTarget.dataset.card_id
      + '&wedding_time=' + e.currentTarget.dataset.wedding_time
      + '&site=' + e.currentTarget.dataset.site
      + '&latitude=' + e.currentTarget.dataset.latitude
      + '&longitude=' + e.currentTarget.dataset.longitude,
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
      //return;
    }
    setTimeout(function () {
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
    // console.log(app.globalData.userInfo.id)
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getid()
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
    this.getid()
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






/**
 * 婚礼日期倒计时方法
*/
// function countdown(that) {
//  var EndTime = that.data.end_time || [];           // 这里的时间是时间戳
//  var NowTime = new Date().getTime();
//  var total_micro_second = EndTime - NowTime || [];
//  console.log('剩余时间：' + total_micro_second);
//   // 渲染倒计时时钟
//   that.setData({
//   clock: dateformat(total_micro_second)
//   });
//   if (total_micro_second <= 0) {
//   that.setData({
//    clock: "已经截止"
//   });
//   //return;
//   }
//   setTimeout(function () {
//   total_micro_second -= 1000;
//   countdown(that);
//   }
//   , 1000)
//  }

//  // 时间格式化输出，如11:03 25:19 每1s都会调用一次
//  function dateformat(micro_second) {
//   // 总秒数
//   var second = Math.floor(micro_second / 1000);
//   // 天数
//   var day = Math.floor(second/3600/24);
//   // 小时
//   var hr = Math.floor(second/3600%24);
//   // 分钟
//   var min = Math.floor(second/60%60);
//   // 秒
//   var sec = Math.floor(second%60);
//   return day + "天" + hr + "小时" + min + "分钟" + sec+"秒";
//  }