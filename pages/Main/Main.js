var constants = require('../../static/ProtocolType.js')
var controller = require('../../utils/controller_onec.js');
var app = getApp();
var j = 0;
var doommList = [];
var i = 0;
var page = undefined;
var DanmakuInput;
var danmaku_time;                 // 弹幕定时器
var danmaku_out_time;             // 定时删除的settimeout方法
var danmaku_time_close;
var readyshow = 0;                //用来判断是否是第一次进入页面 是弹幕正常显示
var getlistTime;
var picswiperTime;
var tensecond;                    //十秒
var EARTH_RADIUS = 6378137;


class Doomm {
  constructor(pic, text, time) {
    this.text = text;
    this.time = time;
    this.display = true;
    this.pic = pic
    let tat = this;
    this.id = i++;
    danmaku_out_time = setTimeout(function () {
      if (doommList.indexOf(tat) != -1) {
        doommList.splice(page.data.doommData.indexOf(tat), 1);
        page.setData({
          doommData: doommList
        });
      }
    }, this.time * 1000)
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isOpenDanmaku: false,
    photoIsEmpty: false,
    wedding_id: null,
    wedding_time: [],
    site: '',
    latitude: null,
    longitude: null,

    clubs: [],
    winHeight: null,
    windowHeight: null,
    winWidth: null,
    Height: null,
    isDanmaku: true,
    danmaku_input: false,
    bind_shootValue: '',
    doommData: [],                                                                                      // 弹幕内容显示
    dmtext: [],                                                      // 文本内容，后面可加入头像内容
    user_role: 5,                                                  // 用户角色状态
    Isfullscreen: false,                                             // 是否点击播放全屏视频
    groom_avater: '',
    groom_name: '',
    bride_avater: '',
    bride_name: '',
    mylatitude: null,                                                //用户所在纬度
    mylongitude: null,                                               // 用户所在经度
    wedding_company: '',
    wedding_mc: '',
    banquet_hall: '',                                                //宴会厅
    Record_time: null
  },

  //跳转到地图
  toMap: function () {
    wx.openLocation({
      latitude: parseFloat(this.data.latitude),
      longitude: parseFloat(this.data.longitude),
      scale: 18,
      name: this.data.site.name
    })
  },

  //弹幕打开关闭事件
  openDan: function () {
    this.setData({
      isDanmaku: !this.data.isDanmaku
    })
    if (!this.data.isDanmaku) {
      clearInterval(danmaku_time);
      clearInterval(getlistTime);
      clearTimeout(tensecond);
      danmaku_time = null;
      getlistTime = null;
      tensecond = null;
      // for(var k=1; k<= 5000/600; k++){
      //   clearTimeout(danmaku_out_time);
      // }
      this.setData({
        doommData: [],
        isOpenDanmaku: false
      });
      doommList = [];
      i = 0;
      j = 0;
    } else {
      this.barrage_achieve();
      this.setData({
        isOpenDanmaku: true
      })
    }
  },

  //获取图片/视频列表
  getImgVi: function () {
    var that = this;
    controller.REQUEST({
      servername: constants.IMAGE_SERVER_NAME,
      methodname: constants.GET_PHOTO_LIST,
      data: {
        action_name: "get_photo_list",
        data: {
          wedding_id: that.data.wedding_id,
          page_no: 1,
          page_size: 1000
        }
      }
    })
  },
  /**
   * 获取照片和视频的数据
  */
  getImgViData: function (data) {
    var that = this;
    var isempty = null;
    if (data.length == 0) {
      isempty = true;
    } else {
      isempty = false;
    }
    that.data.clubs = data;
    that.setData({
      clubs: data,
      photoIsEmpty: isempty
    })
    // that.autoplay();              //自动轮播图片和视频
  },

  //触摸开始事件
  touchstart: function (e) {
    console.log(e.touches[0].pageX);
    this.data.touchDot = e.touches[0].pageX;
    var that = this;
    this.data.interval = setInterval(function () {
      that.data.time += 1;
    }, 100);
  },

  //触摸移动事件
  touchmove: function (e) {
    let touchMove = e.touches[0].pageX;
    let touchDot = this.data.touchDot;
    let time = this.data.time;
    // console.log("touchMove: " + touchMove + ", touchDot: " + touchDot + ", diff: " + (touchMove - touchDot));
    //向左滑动
    if (touchMove - touchDot <= -40 && time < 10 && !this.data.done) {
      // console.log("向左滑动");
      this.data.done = true;
      this.scrollLeft();
    }
    //向右滑动
    if (touchMove - touchDot >= 40 && time < 10 && !this.data.done) {
      // console.log("向右滑动");
      this.data.done = true;
      this.scrollRight();
    }
  },

  //触摸结束事件
  touchend: function (e) {
    clearInterval(this.data.interval);
    this.data.time = 0;
    this.data.done = false;
  },

  //向左滑动事件
  scrollLeft() {
    var animation2 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animation3 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animation4 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })

    // this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation4 = animation4;
    // this.animation5 = animation5;

    // this.animation1.translateX(-60).opacity(0).step();
    this.animation2.translateX(0).opacity(0.5).scale(0.8, 0.8).step();
    this.animation3.translateX(this.data.winWidth * -0.5).opacity(0.5).scale(1, 1).step();
    this.animation4.translateX(this.data.winWidth * -0.7).opacity(1).scale(1.4, 1.4).step();
    // this.animation5.translateX(-30).opacity(0.5).scale(1,1).step();


    this.setData({
      // animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
      animation4: animation4.export(),
      // animation5: animation5.export()
    })

    var that = this;
    setTimeout(function () {
      // that.animation1.translateX(-50).opacity(0.2).scale(0.8, 0.8).step({ duration: 0, timingFunction: 'linear'});
      that.animation2.translateX(0).opacity(0.5).scale(1, 1).step({ duration: 0, timingFunction: 'linear' });
      that.animation3.translateX(that.data.winWidth * -0.22).opacity(1).scale(1.4, 1.4).step({ duration: 0, timingFunction: 'linear' });
      that.animation4.translateX(that.data.winWidth * -0.44).opacity(0.5).scale(1, 1).step({ duration: 0, timingFunction: 'linear' });
      // that.animation5.translateX(50).opacity(0.2).scale(0.8, 0.8).step({ duration: 0, timingFunction: 'linear' });
      that.setData({
        // animation1: animation1.export(),
        animation2: animation2.export(),
        animation3: animation3.export(),
        animation4: animation4.export(),
        // animation5: animation5.export()
      })
    }.bind(this), 299)

    let array = this.data.clubs;
    let shift = array.shift();
    array.push(shift);

    setTimeout(function () {
      this.setData({
        clubs: array
      })
    }.bind(this), 298)
  },

  //向右滑动事件
  scrollRight() {
    var animation2 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animation3 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    var animation4 = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })

    // this.animation1 = animation1;
    this.animation2 = animation2;
    this.animation3 = animation3;
    this.animation4 = animation4;
    // this.animation5 = animation5;

    // this.animation1.translateX(30).opacity(0.5).scale(1,1).step();
    this.animation2.translateX(100).opacity(1).scale(1.4, 1.4).step();
    this.animation3.translateX(130).opacity(0.5).scale(1, 1).step();
    this.animation4.translateX(this.data.winWidth * -0.44).opacity(0.2).scale(0.8, 0.8).step();
    // this.animation5.translateX(130).opacity(0).step();


    this.setData({
      // animation1: animation1.export(),
      animation2: animation2.export(),
      animation3: animation3.export(),
      animation4: animation4.export(),
      // animation5: animation5.export()
    })

    var that = this;
    setTimeout(function () {
      // that.animation1.translateX(-50).opacity(0.2).scale(0.8, 0.8).step({ duration: 0, timingFunction: 'linear' });
      that.animation2.translateX(0).opacity(0.5).scale(1, 1).step({ duration: 0, timingFunction: 'linear' });
      that.animation3.translateX(that.data.winWidth * -0.22).opacity(1).scale(1.4, 1.4).step({ duration: 0, timingFunction: 'linear' });
      that.animation4.translateX(that.data.winWidth * -0.44).opacity(0.5).scale(1, 1).step({ duration: 0, timingFunction: 'linear' });
      // that.animation5.translateX(50).opacity(0.2).scale(0.8, 0.8).step({ duration: 0, timingFunction: 'linear' });
      that.setData({
        // animation1: animation1.export(),
        animation2: animation2.export(),
        animation3: animation3.export(),
        animation4: animation4.export(),
        // animation5: animation5.export()
      })
    }.bind(this), 299)

    let array = this.data.clubs;
    let pop = array.pop();
    array.unshift(pop);

    setTimeout(function () {
      this.setData({
        clubs: array
      })
    }.bind(this), 298)
  },

  //定时器轮播图向左滑动
  autoplay: function () {
    var that = this;
    that.scrollLeft();
    picswiperTime = setTimeout(function () {
      that.autoplay();
    }, 5000);
  },

  //定时器弹幕滚动实现
  barrage_achieve: function () {
    var that = this;
    that.getdanmakulist();
    danmaku_time = setInterval(function () {
      if (j == that.data.dmtext.length) {
        j = 0;
        clearInterval(danmaku_time);
        tensecond = setTimeout(function () {
          that.bind_barrage_data(that.data.dmtext[j].pic, that.data.dmtext[j].text);
          j++;
          that.barrage_achieve();
        }, 20000)
      } else {
        that.bind_barrage_data(that.data.dmtext[j].pic, that.data.dmtext[j].text);
        j++;
      }
    }, 1000);
  },

  //绑定弹幕数据
  bind_barrage_data: function (pic, text) {
    var that = this;
    doommList.push(new Doomm(pic, text, 7));
    that.setData({
      doommData: doommList
    })
  },

  //显示输入框
  danmakuInput: function () {
    var that = this;
    that.setData({
      danmaku_input: true,
    })
  },

  //发射弹幕
  bind_shoot: function (e) {
    var that = this;
    that.setData({
      bind_shootValue: '',
      danmaku_input: false,
    })
  },

  //跳转到设置页面
  TosetPage: function () {
    if (this.data.user_role == 1 || this.data.user_role == 2 || this.data.user_role == 3 || this.data.user_role == 4) {
      wx.navigateTo({
        url: '../Set/Set?wedding_id=' + this.data.wedding_id,
      })
    } else {
      wx.navigateTo({
        url: '../SetGuest/SetGuest?wedding_id=' + this.data.wedding_id,
      })
    }
  },

  //跳转到请帖页面
  toCardPage: function () {
    wx.navigateTo({
      url: '../Main_sonPage/Card/Card?wedding_id=' + this.data.wedding_id + '&role=' + this.data.user_role
    })
  },

  //跳转到相册页面
  toPhoto: function () {
    if (this.data.user_role != 5) {
      wx.navigateTo({
        url: '../Main_sonPage/photo/photo?wedding_id=' + this.data.wedding_id + '&role=' + this.data.user_role,
      })
    } else {
      wx.navigateTo({
        url: '../Main_sonPage/guestPhoto/photo?wedding_id=' + this.data.wedding_id,
      })
    }
  },

  //跳转到宾客页面
  toGuest: function () {
    wx.navigateTo({
      url: '../Main_sonPage/Guest/guest?wedding_id=' + this.data.wedding_id,
    })
  },

  // 跳转到礼金页面
  toBalance: function () {
    if (this.data.user_role != 5) {
      wx.navigateTo({
        url: '../Main_sonPage/balance/balance?wedding_id=' + this.data.wedding_id,
      })
    } else {
      wx.navigateTo({
        url: '../Main_sonPage/CashGifts/cashgifts?wedding_id=' + this.data.wedding_id,
      })
    }
  },

  // 预览图片
  preview: function (e) {
    var imglist = [];
    if (e.currentTarget.dataset.type == '1') {
      for (var i = 0; i < page.data.clubs.length; i++) {
        imglist.push(page.data.clubs[i].url);
      }
      wx.previewImage({
        current: e.currentTarget.dataset.url,
        urls: imglist
      })
    } else if (e.currentTarget.dataset.type == '2') {
      this.setData({
        Isfullscreen: true,
      })
      this.videoContext.play();
      this.videoContext.requestFullScreen();
    }
  },

  /**
   * 关闭全屏
  */
  colseFullscreen: function (e) {
    var that = this;
    console.log(e.detail.fullScreen);
    if (!e.detail.fullScreen) {
      that.setData({
        Isfullscreen: false
      })
    }
  },

  //获取设备基本信息
  getwindowinfo: function () {
    var that = this;

    try {
      var res = wx.getSystemInfoSync();
      // console.log(res);
      that.setData({
        winHeight: res.windowHeight * 0.57,
        windowHeight: res.windowHeight,
        winWidth: res.windowWidth,
        Height: res.windowHeight,
      })
    } catch (e) {
      console.log(e);
    }
  },

  // //获取当前婚礼用户角色
  // getrole: function () {
  //   var that = this;
  //   wx.getStorage({
  //     key: 'USER_ROLE_WEDDING',
  //     success: function (res) {
  //       // console.log(res);
  //       that.setData({
  //         user_role: res.data,
  //       })
  //     }
  //   })
  // },

  //获取弹幕列表      
  getdanmakulist: function () {
    var that = this;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_DANMAKU_LIST,
      data: {
        action_name: "get_danmaku_list",
        data: {
          card_id: that.data.wedding_id,
          time: parseInt(new Date().getTime() / 1000),
        }
      }
    })
  },
  /**
   * 获取弹幕列表数据
  */
  getDanMakuData: function (data) {
    var that = this;
    wx.hideLoading();
    that.data.dmtext = data;
    if (data.length == 0) {
      return false;
    } else {
      //弹幕实现
    }
  },

  //秒级刷新
  // test_danmu: function () {
  //   var that = this;
  //   getlistTime = setInterval(function () {
  //     // console.log(1);
  //     that.getdanmakulist();
  //   }, 5000);
  //   // if (that.data.dmtext.length != 0) {
  //   that.barrage_achieve();
  //   // }
  // },

  //发送弹幕
  sendDanmaku: function (e) {
    // console.log(e.detail.value);
    var that = this;
    DanmakuInput = e.detail.value;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.SEND_DANMAKU,
      data: {
        action_name: "send_danmaku",
        data: {
          card_id: that.data.wedding_id,
          text: e.detail.value,
          user_id: app.globalData.userInfo.id
        }
      }
    })
  },

  /**
   * 发送弹幕
   */
  sendDanmakuData: function (data) {
    // console.log(DanmakuInput);
    var that = this;
    if (data.code != 0) {
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }
    if (that.data.dmtext.length == 0) {
      that.data.dmtext.push({ id: app.globalData.userInfo.id, nick_name: app.globalData.userInfo.nickName, pic: app.globalData.userInfo.avatarUrl, text: DanmakuInput })
    } else {
      that.data.dmtext.splice(j, 0, { id: app.globalData.userInfo.id, nick_name: app.globalData.userInfo.nickName, pic: app.globalData.userInfo.avatarUrl, text: DanmakuInput })
    }
    that.setData({
      bind_shootValue: '',
      danmaku_input: false
    })
  },

  /**
   * 获取用户所在地址信息
   */
  getuserlocation: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                type: 'gcj02',
                success: function (res) {
                  // console.log(res);
                  that.setData({
                    mylatitude: res.latitude,
                    mylongitude: res.longitude
                  })
                }
              })
            }
          })
        } else {
          wx.getLocation({
            type: 'gcj02',
            success: function (res) {
              // console.log(res);
              that.setData({
                mylatitude: res.latitude,
                mylongitude: res.longitude
              })
            }
          })
        }
      }
    })
  },

  /**
   * 用户所在点到婚礼地点距离
  */
  getDistance: function () {
    var that = this;
    // console.log(that.data.latitude);
    // console.log(that.data.longitude);
    // console.log(that.data.mylatitude);
    // console.log(that.data.mylongitude);
    var radLat1 = that.data.latitude*Math.PI/180.0;
    var radLat2 = that.data.mylatitude*Math.PI/180.0;
    var radLon1 = that.data.longitude*Math.PI/180.0;
    var radLon2 = that.data.mylongitude*Math.PI/180.0;
    var a = radLat1 - radLat2;
    var b = radLon1 - radLon2;

    var s = 2*Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) + Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s*6378137.0;
    s = Math.round(s*10000) / 10000.0;
    if(s>100){
      wx.showModal({
        title: '提示',
        content:'您未进入婚礼场地，无法进入婚礼页面',
        confirmText:'正在赶往',
        showCancel: false
      })
      that.enterChatroom();
    } else {
      that.enterChatroom();
    }
  },

  /**
   * 进入现场
  */
  enterChatroom: function () {
    var that = this;
    // that.getDistance();
    controller.REQUEST({
      servername: constants.CHATROOM,
      methodname: constants.ENTER_CHATROOM,
      data: {
        weddingId: parseInt(that.data.wedding_id),
        userId: parseInt(app.globalData.userInfo.id),
        latitude: parseFloat(that.data.latitude),
        longitude: parseFloat(that.data.longitude)
      }
    })
  },

  /**
   * 获取进入现场的数据
  */
  getEnterData: function (data) {
    var that = this;
    console.log(data);
    if (data.code == 0) {
      wx.navigateTo({
        url: '../Scene/Scene?chatroomid=' + data.data + '&wedding_id=' + that.data.wedding_id + '&wedding_company=' + that.data.wedding_company
      })
    }
  },

  getWeddingInfo: function () {
    var that = this;

    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_INVITATION,
      data: {
        action_name: 'get_invitation',
        data: {
          card_id: that.data.wedding_id
        }
      }
    })
  },

  /**
   * 获取婚礼信息数据
   */
  getWeddingData: function (data) {
    var info = data;
    // console.log(data);
    var TIME = this.convert_Time(info.wedding_time);                 //info.wedding_time.split(" ");
    // console.log(TIME)
    this.setData({
      wedding_time: TIME,
      site: JSON.parse(info.site),
      groom_avater: info.bridegroom_pic,
      groom_name: info.bridegroom,
      bride_avater: info.bride_pic,
      bride_name: info.bride,
      latitude: info.latitude,
      longitude: info.longitude,
      wedding_company: info.wedding_company,
      wedding_mc : info.wedding_mc,
      banquet_hall: info.banquet_hall
    })
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
    obj.day = year + '年' + month + '月' + day + '日';
    obj.time = hour + '时' + minute + '分';
    obj.week = week;

    return obj;
  },

  addZero: function (temp) {
    if(temp < 10)
      return "0"+temp;
    else 
      return temp;
  },

  //婚礼回执
  huizhi: function (val) 　{
    var that = this;
    console.log('添加回执');
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.RETURN_RECEIPT,
      data: {
        action_name: 'return_receipt',
        data: {
          user_id: app.globalData.userInfo.id,
          wedding_id: val, 
        }
      }
    })
  },

  /**
   * 婚礼回执数据
  */
  huizhiData: function (data) {
    if(data.code == 0){
      console.log('success');
    } else {
      wx.showToast({
        title: data.msg
      })
    }
  },


  /**
   * 获取请求信道获取的数据
  */
  getdata: function (server, method, data) {
    console.log('获取到'+ method + '数据')
    var that = this;
    // if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data).data;
      switch (method) {
        case constants.GET_PHOTO_LIST:
          that.getImgViData(ProtocolData);
          break;
        case constants.GET_DANMAKU_LIST:
          that.getDanMakuData(ProtocolData);
          break;
        case constants.SEND_DANMAKU:
          that.sendDanmakuData(JSON.parse(data));
          break;
        case constants.ENTER_CHATROOM:
          that.getEnterData(JSON.parse(data));
          break;
        case constants.GET_INVITATION:
          that.getWeddingData(ProtocolData);
          break;
        case constants.RETURN_RECEIPT: 
          that.huizhiData(JSON.parse(data));
          break;
      }
    // }
  },

  getbroadcast: function (data) {
    console.log(data);
  },

  /**
   * 初始化页面请求
  */
  initPage: function () {
    var that = this;
    that.getWeddingInfo();
    if(!this.data.isOpenDanmaku){
      that.barrage_achieve();
    }
    that.getImgVi();
    that.huizhi(that.data.wedding_id);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // this.getImgVi();                                  //获取图片和视频
    // this.getWeddingInfo();
    this.huizhi(options.wedding_id);               //表示这个人进入婚礼 
    this.getuserlocation();                        // 获取用户地址
    readyshow = 0;                                //用来判断是否是第一次进入页面 是弹幕正常显示
    this.data.wedding_id = options.wedding_id;
    page = this;
    this.getwindowinfo();
    if(options.user_status){
      this.setData({
        user_role: options.user_status
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {


    this.videoContext = wx.createVideoContext('playvideo');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    controller.init(this.initPage, this.getdata, this.getbroadcast)                              // 弹幕实现
    this.getImgVi();                                  //获取图片和视频
    this.getWeddingInfo();
    // if(!app.globalData.ishidden){
    // console.log('隐藏')
    var that = this;
    clearInterval(danmaku_time);
    clearInterval(getlistTime);
    clearTimeout(picswiperTime);
    clearTimeout(tensecond);
    danmaku_time = null;
    getlistTime = null;
    tensecond = null;
    this.setData({
      doommData: [],
      isOpenDanmaku: false
    });
    doommList = [];
    i = 0;
    j = 0;
   
    // }
    if(!this.data.isOpenDanmaku) {                                // 判断
        this.barrage_achieve();
        this.setData({
          isOpenDanmaku: true,  
        })
      } 

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('隐藏页面')
    var that = this;
    clearInterval(danmaku_time);
    clearInterval(getlistTime);
    clearTimeout(picswiperTime);
    clearTimeout(tensecond);
    danmaku_time = null;
    getlistTime = null;
    tensecond = null;
    this.setData({
      doommData: [],
      isOpenDanmaku: false
    });
    doommList = [];
    i = 0;
    j = 0;

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('卸载页面')
    var that = this;
    clearInterval(danmaku_time);
    clearInterval(getlistTime);
    clearTimeout(picswiperTime);
    clearTimeout(tensecond);
    danmaku_time = null;
    getlistTime = null;
    tensecond = null;
    this.setData({
      doommData: [],
    });
    doommList = [];
    i = 0;
    j = 0;
    wx.redirectTo({
      url: '../index/index'
    })
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
    return {
      title: '婚礼宝',
      desc: '方便的婚礼小程序',
      path: '/pages/Main/Main?wedding_id=' + this.data.wedding_id + ''
    }
  }
})