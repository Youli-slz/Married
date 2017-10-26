var sq = require('../../utils/sRequest.js');
var app = getApp();
var j = 0;
var doommList = [];
var i = 0;
var page = undefined;
var danmaku_time;                 // 弹幕定时器
var danmaku_out_time;             // 定时删除的settimeout方法
var danmaku_time_close; 
var readyshow = 0;                //用来判断是否是第一次进入页面 是弹幕正常显示
var getlistTime;


class Doomm{
  constructor(pic, text, time) {
    this.text = text;
    this.time = time;
    this.display = true;
    this.pic = pic
    let tat = this;
    this.id = i++;
    danmaku_out_time = setTimeout(function (){
      if(doommList.indexOf(tat) != -1) {
        doommList.splice(page.data.doommData.indexOf(tat),1);
        page.setData({
          doommData : doommList
        });
      }
    }, this.time*1000)
  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wedding_id: null,
    wedding_time: '',
    site: '',
    latitude: '',
    longitude: '',

      clubs: [
      'http://7xld1x.com1.z0.glb.clouddn.com/tmp_1759476266o6zAJs6e4iQOHuo7DT2vSURT-cTg82029d28dc1bdbdffd7ab4588c4bfd38.JPG',
      'http://7xld1x.com1.z0.glb.clouddn.com/tmp_1759476266o6zAJs6e4iQOHuo7DT2vSURT-cTgc208430003b288860175f903667ee31f.JPG',
      'http://7xld1x.com1.z0.glb.clouddn.com/tmp_1759476266o6zAJs6e4iQOHuo7DT2vSURT-cTg90b762cae3414de73fb52500a1250b44.JPG',
      'http://7xld1x.com1.z0.glb.clouddn.com/tmp_1759476266o6zAJs6e4iQOHuo7DT2vSURT-cTg9e0f8508557156f81ec6574558d8d978.JPG',
      'http://7xld1x.com1.z0.glb.clouddn.com/tmp_1759476266o6zAJs6e4iQOHuo7DT2vSURT-cTga626482ed7a10da6e43054df24356b22.JPG',    
    ],
    winHeight: null,
    windowHeight: null,
    winWidth: null,
    Height: null,
    isDanmaku: true,
    danmaku_input: false,
    bind_shootValue: '',
    doommData:[],                                                                                      // 弹幕内容显示
    dmtext:[],                                                      // 文本内容，后面可加入头像内容
    user_role: '',                                                  // 用户角色状态
  },

  //跳转到地图
  toMap: function () {
    wx.openLocation({
      latitude: parInt(this.data.latitude),
      longitude: parInt(this.data.longitude),
      scale: 18
    })
  },

  //弹幕打开关闭事件
  openDan: function () {
    this.setData({
      isDanmaku: !this.data.isDanmaku
    })
    if(!this.data.isDanmaku) {
      clearInterval(danmaku_time);
      clearInterval(getlistTime);
      // for(var k=1; k<= 5000/600; k++){
      //   clearTimeout(danmaku_out_time);
      // }
      this.setData({
        doommData: [],
      });
      doommList = [];
      i = 0;
      j = 0;
    } else {
      this.barrage_achieve();
    }
  },

  //触摸开始事件
  touchstart: function(e) {
    console.log(e.touches[0].pageX);
    this.data.touchDot = e.touches[0].pageX;
    var that = this;
    this.data.interval = setInterval(function(){
      that.data.time+=1;
    },100);
  },

  //触摸移动事件
  touchmove: function(e) {
    let touchMove = e.touches[0].pageX;
    let touchDot = this.data.touchDot;
    let time = this.data.time;
    console.log("touchMove: " + touchMove + ", touchDot: " + touchDot + ", diff: " + (touchMove - touchDot));
    //向左滑动
    if(touchMove - touchDot <= -40 && time<10 &&!this.data.done) {
      console.log("向左滑动");
      this.data.done = true;
      this.scrollLeft();
    }
    //向右滑动
    if (touchMove - touchDot >= 40 && time < 10 && !this.data.done) {
      console.log("向右滑动");
      this.data.done = true;
      this.scrollRight();
    }
  },

  //触摸结束事件
  touchend: function(e) {
    clearInterval(this.data.interval);
    this.data.time = 0;
    this.data.done = false;
  },

  //向左滑动事件
  scrollLeft(){
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
    this.animation2.translateX(0).opacity(0.5).scale(0.8,0.8).step();
    this.animation3.translateX(this.data.winWidth * -0.5).opacity(0.5).scale(1,1).step();
    this.animation4.translateX(this.data.winWidth * -0.7).opacity(1).scale(1.4,1.4).step();
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
    setTimeout(function () {
      that.autoplay();
    }, 5000);
  },

  //定时器弹幕滚动实现
  barrage_achieve: function() {
    var that = this;
    // doommList = []
    danmaku_time = setInterval(function () {
      if(j == that.data.dmtext.length) {
        j = 0;
      }
      console.log(that.data.dmtext[j])
      that.bind_barrage_data(that.data.dmtext[j].pic, that.data.dmtext[j].text);
      j++;
    }, 600);
  },

  //绑定弹幕数据
  bind_barrage_data: function (pic,text) {
    var that = this;
    doommList.push(new Doomm(pic,text,5));
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
    console.log(e);
    that.setData({
      bind_shootValue: '',
      danmaku_input: false, 
    })
  },

  //跳转到设置页面
  TosetPage: function () {
    wx.navigateTo({
      url: '../Set/Set',
    })
  },

  //跳转到请帖页面
  toCardPage: function () {
    wx.navigateTo({
      url: '../Main_sonPage/Card/Card',
    })
  },

  //跳转到相册页面
  toPhoto: function () {
    wx.navigateTo({
      url: '../Main_sonPage/photo/photo?wedding_id='+ this.data.wedding_id +'&role='+ this.data.user_role,
    })
  },

  //跳转到宾客页面
  toGuest: function () {
    wx.navigateTo({
      url: '../Main_sonPage/Guest/guest?wedding_id='+ this.data.wedding_id,
    })
  },

  // 跳转到礼金页面
  toBalance: function () {
    if(this.data.user_role != 5){
      wx.navigateTo({
        url:'../Main_sonPage/balance/balance?wedding_id=' + this.data.wedding_id,
      })
    } else {
      wx.navigateTo({
        url: '../Main_sonPage/CashGifts/cashgifts?wedding_id=' + this.data.wedding_id,
      })
    }
  },

  // 预览图片
  preview: function (e) {
    e.currentTarget.dataset.url
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: page.data.clubs
    })
  },

  //获取设备基本信息
  getwindowinfo: function () {
    var that = this;
  
    try {
      var res = wx.getSystemInfoSync();
      console.log(res);
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

  //获取当前婚礼用户角色
  getrole: function () {
    var that = this;
    wx.getStorage({
      key: 'USER_ROLE_WEDDING',
      success: function (res) {
        console.log(res);
        that.setData({
          user_role: res.data,
        })
      }
    })
  },

  //获取弹幕列表      
  getdanmakulist: function () {
    var that = this;
    sq.POST({
      url: '/socket/response.do',
      servername: "logic",
      params:{
        action_name: "get_danmaku_list",
        data:{
          card_id: that.data.wedding_id,
          time: parseInt(new Date().getTime() / 1000),
        }
      },
      success: function (res) {
        console.log(that.data.user_role);
        that.data.dmtext = res;
        console.log(that.data.dmtext)
        if(res.length == 0){
          return false;
          console.log("为空");
        } else {
                                   // 弹幕实现
        }
      }
    })
  },

  //秒级刷新
  test_danmu: function () {
    var that = this;
    getlistTime = setInterval(function () {
      that.getdanmakulist();
    },2000);
    if(that.data.dmtext.length != 0){
      that.barrage_achieve();
    }
  },

  //发送弹幕
  sendDanmaku: function (e) {
    // console.log(e.detail.value);
    var that = this;

    sq.POST({
      url: '/socket/response.do',
      servername: "logic",
      params: {
        action_name: "send_danmaku",
        data: {
          card_id: that.data.wedding_id,
          text: e.detail.value,
          user_id: app.globalData.userInfo.id
        }
      },
      success: function (res) {
        console.log(res);
          that.setData({
            bind_shootValue: '',
            danmaku_input: false, 
          })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getrole();                               //获取用户角色

    readyshow = 0;                                //用来判断是否是第一次进入页面 是弹幕正常显示
    this.data.wedding_id = options.wedding_id;
    this.data.latitude = options.latitude;
    this.data.longitude = options.longitude;
    this.setData({
      wedding_time: options.wedding_time,
      site: options.site,
    })
    page = this;
    this.autoplay();                // 当有获取数据接口时， 先获取数据再自动播放
    this.getwindowinfo();

    console.log(this.data.wedding_id)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    readyshow = 1;
    // this.test_danmu();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(readyshow == 1) {                                // 判断
        // this.test_danmu();                         // 弹幕实现
        console.log(this.data.doommData)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('隐藏')
    var that = this;
      clearInterval(danmaku_time);
      clearInterval(getlistTime);
      this.setData({
        doommData: [],
      });
      doommList = [];
      i = 0;
      j = 0;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('是否有卸载')
    var that = this;
      clearInterval(danmaku_time);
      clearInterval(getlistTime);
      this.setData({
        doommData: [],
      });
      doommList = [];
      i = 0;
      j = 0;
    wx.navigateBack({
      url:'../index/index'
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
  
  }
})