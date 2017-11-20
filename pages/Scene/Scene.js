var wxSortPickerView = require('../../components/wxSortPickerView/wxSortPickerView.js');
var sq = require('../../utils/sRequest.js');
var constants = require('../../static/ProtocolType.js');
var controller = require('../../utils/controller_onec.js');
// var qcloud = require('../../static/bower_components/wafer-client-sdk/index');           // 引入 QCloud 小程序增强 SDK
var config = require('../../config');
var app = getApp();
var memberVal = 0;
var getlist = 0;
var Record;      //获取录音时长
var time = 0;         //录音时间长度
var RecordUrl;
var recod_Time;
var count_time;



//============================================================
/**
 * 当前页面常用定义方法
*/
function createUserMessage(content, type, user) {
  return { msg: { msg: content, msgType: type }, user: { id: user.id, nick_name: user.nickName, pic: user.avatarUrl }, loading: 'loading' }
}

//============================================================


Page({

  /**
   * 页面的初始数据
   */
  data: {
    downfile: '',                    // 语音文件是否下载完成       
    isplay: '',                     // 是否播放语音
    disButton: false,               //点击按钮后禁止点击
    haveMc: false,
    newaddcontent: [],
    voiceUrl: '',
    isSpeaking: false,
    windowHeight: null,
    winWidth: null,
    winHeight: null,
    isFunction: false,
    istape: false,
    showList: false,
    showNoMore: false,
    admin_list: [],
    guest_list: [],
    messageList: [],
    allmessageList: [],
    Card_Id: null,
    chartroomId: null,
    USERID: app.globalData.userInfo.id,
    LastID: 0,                                  //消息最后一条msg的id
    saveLastID: 0,                              // 存放获取到的消息列表的最后一条msg的id 当上拉时获取
    inputValue: '',
    lastMessageId: 'msg_1',                              // 最后一条消息ID
    send_message_id: null,
    showloading: false,
    isrecord: false,
    iscroll: true,
    getmsgTime: ''
  },

  //============================房间消息=======================================

  //图片预览
  showImage: function (event) {
    console.log(event.target.dataset.urls);
    console.log(event.target.dataset.pic);
    wx.previewImage({
      current: event.target.dataset.pic,
      urls: event.target.dataset.urls
    })
  },

  // 文字内容
  speakWord: function (e) {
    if (e.detail.value == '') {
      wx.showToast({
        title: '内容不能为空',
        image: '../../assets/image/cuo.png',
        duration: 1000,
        mask: true
      })
    } else {
      var con = e.detail.value;
      var content = JSON.stringify({ content: con });
      this.charContent(content, 1);
    }
  },

  //聊天内容发送
  charContent: function (content, msgType) {
    var that = this;
    var i = 1;
    var message = new Object();
    var allmessage = new Object();

    controller.REQUEST({
      servername: constants.CHATROOM,
      methodname: constants.SEND_MESSAGE,
      data: {
        chatroomId: parseInt(that.data.chatroomId),
        weddingId: parseInt(that.data.Card_Id),
        userId: parseInt(app.globalData.userInfo.id),
        msgType: msgType,
        msg: content
      }
    })

    allmessage = createUserMessage(content, msgType, app.globalData.userInfo, );
    delete allmessage.loading;
    message = createUserMessage(JSON.parse(content), msgType, app.globalData.userInfo, );

    var id = 99999999//that.data.messageList[that.data.messageList.length - 1].msg.id + 1;
    that.data.newaddcontent.push(id);
    message.msg.id = id;
    allmessage.msg.id = id;
    that.data.messageList.push(message);
    that.data.allmessageList.splice(0, 0, allmessage);
    that.setData({
      messageList: that.data.messageList,
      lastMessageId: 'msg_' + id,
      inputValue: ''
    })
  },

  // 获取发送消息后返回的数据
  getSendContentData: function (data) {
    var that = this;
    var message = new Object();
    if (data.code == 0) {

      that.data.messageList
      console.log(data.data);
      for (var i = 0; i < that.data.messageList.length; i++) {
        if (that.data.messageList[i].msg.id == that.data.newaddcontent[0]) {
          that.data.messageList[i].loading = null;
          that.data.messageList[i].msg.id = data.data;
          that.data.newaddcontent.splice(0, 1);
        }
      }
      that.data.messageList[that.data.messageList.length - 1].loading = null;
      that.setData({
        messageList: that.data.messageList,
        lastMessageId: 'msg_' + that.data.messageList[that.data.messageList.length - 1].msg.id
      })
      console.log('发送成功');
    } else {
      for (var i = 0; i < that.data.messageList.length; i++) {
        if (that.data.messageList[i].msg.id == that.data.newaddcontent[0]) {
          that.data.messageList[i].loading = 'error';
          that.data.messageList[i].msg.id = data.data;
          that.data.newaddcontent.splice(0, 1);
        }
      }
      that.setData({
        messageList: that.data.messageList,
        lastMessageId: 'msg_' + that.data.messageList[that.data.messageList.length - 1].msg.id
      })
      wx.showToast({
        title: data.msg,
        duration: 2000,
        image: '../../assets/image/cuo.png'
      })
    }
  },

  //显示没有更多
  shownomore: function () {
    var that = this;
    that.setData({
      showNoMore: true
    })
  },

  // 获取房间消息列表
  getChatRoomMsgList: function () {
    var that = this;
    that.data.messageList = [];
    controller.REQUEST({
      servername: constants.CHATROOM,
      methodname: constants.GET_MESSAGE_LIST,
      data: {
        chatroomId: parseInt(that.data.chatroomId),
        weddingId: parseInt(that.data.Card_Id),
        usreId: parseInt(app.globalData.userInfo.id),
        lastId: parseInt(that.data.LastID)
      }
    })
  },

  //获取房间消息列表的数据
  getChatRoomData: function (data) {
    var isfirst = this.data.LastID;
    var allmessageId, msgTime;
    var that = this;
    if(!that.data.LastID == 0){
       allmessageId = '1_' + that.data.allmessageList[that.data.allmessageList.length-1].msg.id;
       msgTime = that.data.allmessageList[that.data.allmessageList.length-1].msg.createdAt;
    } else {
       allmessageId = data.data[0].msg.id;
    }
    console.log(allmessageId);
    if (data.code == 0) {
      wx.hideLoading();
      if (!data.data) {
        getlist = 1;
        that.shownomore();
        return false;
      } else if (data.data.length < 10) {
        that.shownomore();
        getlist = 1;
      }
      for (var j = 0; j < data.data.length; j++) {
        that.data.allmessageList.push(data.data[j]);
      }
      for (var i = that.data.allmessageList.length - 1; i >= 0; i--) {
        that.data.messageList.push(that.data.allmessageList[i]);
      }
      for (var k = 0; k < that.data.messageList.length; k++) {
        if (that.data.messageList[k].msg.msgType != 0 && typeof that.data.messageList[k].msg.msg == "string") {
          that.data.messageList[k].msg.msg = JSON.parse(that.data.messageList[k].msg.msg);
        }
      }
      console.log(allmessageId)
      getlist = 0;
      that.setData({
        showloading: false,
        messageList: that.data.messageList,
        LastID: that.data.messageList[0].msg.id,
        lastMessageId: 'msg_' + allmessageId,
        // getmsgTime: that.convert_Time(msgTime),
        iscroll: true,
        // LastID: 0
      })
      console.log(that.data.allmessageList)
      // if(isfirst == 0){
      //   that.downpage();
      // }
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000,
        image: '../../assets/image/cuo.png'
      })
    }
  },

  //拉到顶部显示更多
  topEvent: function () {
    var that = this;
    this.setData({
      showloading: true,
      iscroll: false
      // LastID: that.data.saveLastID
    })
    setTimeout(function () {
      if (getlist == 0) {
        getlist = 1;
        that.getChatRoomMsgList();
      }
    }, 300)

  },

  //========================================================================

  // 右侧显示宾客列表
  ShowGuest: function () {
    var that = this;
    that.data.admin_list = [];
    that.data.guest_list = [];
    memberVal = 0;
    this.setData({
      showList: !that.data.showList,
    })
    if (that.data.showList) {
      that.getMemberList(memberVal);
    }
  },

  // 点击留言栏关闭功能栏
  hidden_fun_box: function () {
    if (this.data.isFunction) {
      this.setData({
        isFunction: false,
        winHeight: this.data.winHeight + this.data.windowHeight * 0.2,
      })
    }
  },

  //展示更多里面的功能栏
  showMore: function () {
    var height;
    if (!this.data.isFunction) {
      height = this.data.winHeight - this.data.windowHeight * 0.2;
    } else {
      height = this.data.winHeight + this.data.windowHeight * 0.2;
    }
    this.setData({
      isFunction: !this.data.isFunction,
      winHeight: height,
    })
  },

  //点击显示录音按钮
  Tape: function () {
    this.setData({
      istape: !this.data.istape,
    })
  },

  //点击长按录音
  touchdown: function (e) {
    var that = this;
    console.log(e.timeStamp);
    that.data.Start_time = e.timeStamp;
      recod_Time = setTimeout(function () {
        wx.startRecord({
          success: function (res) {
            that.data.voiceUrl = res.tempFilePath;
          },
          fail: function (err) {
            console.log(err);
          }
        })
      }, 100)
      console.log('按住了按钮');
      var that = this;
      wx.showToast({
        title: '录音中...',
        image: '../../assets/image/record.png',
        duration: 60000
      })
      console.log('播放')
  },

  //播放录音
  toplay: function (e) {
    var that = this;
    that.setData({
      isplay: e.currentTarget.dataset.id,
      downfile: e.currentTarget.dataset.id
    })
    wx.downloadFile({
      url: e.currentTarget.dataset.url,
      success: function (res) {
        that.setData({
          downfile: ''
        })
        wx.playVoice({
          filePath: res.tempFilePath,
          success: function () {
            console.log('开始播放');
          },
          fail: function (res) {
            console.log(res);
          },
          complete:function () {
            console.log('播放结束');
            that.setData({
              isplay: ''
            })
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  //按钮松开 取消录音
  touchup: function (e) {
    console.log(e.timeStamp);
    wx.stopRecord();
    wx.hideToast();
    clearTimeout(recod_Time);
    var that = this;
    var record_msg = new Object();
    var recordTime = e.timeStamp - this.data.Start_time;
    console.log(recordTime);
      if(recordTime > 1000){
        wx.stopRecord();
        // console.log('上传语音');
        // console.log(parseInt(recordTime / 1000));
        setTimeout(function () {
          console.log(that.data.voiceUrl);
          sq.Upload({
            type: 2,
            filePaths: that.data.voiceUrl,
            success: function (res) {
              console.log(res.imageURL);
              record_msg = JSON.stringify({content: res.imageURL, duration: parseInt(recordTime/1000)});
              if(record_msg){
                that.charContent(record_msg, 2);
              } else {
                console.log(record_msg);
              }

            },  
            failure: function (err) {
              console.log(err);
              wx.showToast({
                title: err,
                image: '../../assets/image/cuo.png',
                duration: 2000
              })
            }
          })
        },700);
      } else {
        setTimeout(function () {
          wx.showToast({
            title: '说话时间太短',
            mask: true,
            image: '../../assets/image/slow.png',
            duration: 1300
          })
        },500)
        console.log('说话时间太短');

      }
    console.log("松开了按钮");
    time = 0;
  },

  // 获取房间成员列表
  getMemberList: function (val) {
    var that = this;
    controller.REQUEST({
      servername: constants.CHATROOM,
      methodname: constants.GET_CHATROOM_MEMBER_LIST,
      data: {
        chatroomId: parseInt(that.data.chatroomId),
        weddingId: parseInt(that.data.Card_Id),
        offset: val,
        num: 20
      }
    })
  },

  //获取成员列表数据
  getMemberData: function (data) {
    var that = this;
    console.log(data.data)
    if (data.code == 0) {
      if (data.data.count == 0) {
        memberVal = memberVal - 1;
      } else {
        for (var i = 0; i < data.data.count; i++) {
          if (data.data.list[i].user_status == 5) {
            that.data.guest_list.push(data.data.list[i]);
          } else {
            that.data.admin_list.push(data.data.list[i]);
          }
        }
        wxSortPickerView.init(that.data.guest_list, that);
        that.setData({
          guest_list: that.data.guest_list,
          admin_list: that.data.admin_list
        })
        // if(that.data.allmessageList.length <= 10){
        //   that.setData({
        //     lastMessageId: 'msg_' + that.data.allmessageList[0].msg.id
        //   })
        // }
      }
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000,
        image: '../../assets/image/cuo.png'
      })
    }

  },

  //滚动到成员列表底部获取新的更多成员信息
  lower: function () {
    var that = this;
    memberVal = memberVal + 1;
    that.getMemberList(memberVal);
  },

  //获取设备信息
  getSystemInfo: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight * (1 - 0.15),
          windowHeight: res.windowHeight,
        });
      }
    })
  },

  // 将消息列表显示到底部最新一条位置
  downpage: function () {
    var that = this;
    console.log(that.data.allmessageList[0])
    that.setData({
      lastMessageId: 'msg_' + that.data.allmessageList[0].msg.id
    })
  },

  /**
   * 选择图片
  */
  chooseImage: function () {
    var that = this;
    var content;
    var i = 0;
    var picList = [];
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        sq.Upload({
          type: 1,
          filePaths: res.tempFilePaths,
          success: function (val) {
            i++;
            picList.push(val.imageURL);
            if (i == res.tempFilePaths.length) {
              content = JSON.stringify({ content: picList });
              that.charContent(content, 3);
            }

          }
        })
      }
    })
    // console.log(picList);
  },

  /**
   * 获取信息时间
  */
  convert_Time: function (t){
    var createTime;
    var timesum;
    var nowdate = new Date(); //当前时间
    var zero = new Date(nowdate.getFullYear(), nowdate.getMonth(), nowdate.getDate()).getTime();   //当天凌晨
    var week;
    var date = new Date(t * 1000);
    var year = date.getFullYear();
    var month = this.addZero(date.getMonth() + 1);
    var day = this.addZero(date.getDate());
    var hour = this.addZero(date.getHours());
    var minute = this.addZero(date.getMinutes());
    switch (date.getDay()){
      case 0: week = '星期天'; break;
      case 1: week = '星期一'; break;
      case 2: week = '星期二'; break;
      case 3: week = '星期三'; break;
      case 4: week = '星期四'; break;
      case 5: week = '星期五'; break;
      case 6: week = '星期六'; break;
    }

    if((date.getTime() - zero)/1000 <= 86400){
      createTime = '今天' + " " + hour + ':'+ minute;
      return createTime;
    } else if ((zero - date.getTime())/1000 <= 86400) {
      createTime = '昨天' + " " + hour + ':'+ minute;
      return createTime;
    }else if (this.isSameWeek(date)){
      console.log('本周');
      createTime = week + " " + hour + ':'+ minute;
      return createTime;
    } else {
      createTime = year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + minute;
      return createTime;
    }
  },

  addZero: function (temp) {
    if(temp < 10)
      return '0'+ temp;
    else 
      return temp;
  },

  isSameWeek: function (old) {
    var oneDayTime = 1000*60*60*24;
    var old_count = parseInt(old.getTime()/oneDayTime);
    var now_other = parseInt(new Date().getTime()/oneDayTime);
    return parseInt((old_count+4)/7) == parseInt((now_other+4)/7);
  },

  /**
   * 初始化页面请求
  */
  initPage: function () {
    this.getChatRoomMsgList();
  },

  /**
   * 获取数据
  */
  getdata: function (server, method, data) {
    var that = this;
    if (typeof server == 'string') {
      var ProtocolData = JSON.parse(data);
      switch (method) {
        case constants.SEND_MESSAGE:
          that.getSendContentData(ProtocolData);
          break;
        case constants.GET_MESSAGE_LIST:
          that.getChatRoomData(ProtocolData);
          break;
        case constants.GET_CHATROOM_MEMBER_LIST:
          that.getMemberData(ProtocolData);
          break;
      }
    } else {
      console.log(server);
      wx.showToast({
        title: server.code + server.message,
        image: '../../assets/image/error.png',
        duration: 2000
      })
    }
  },

  /**
   * 获取广播数据
  */
  broadcast: function (data) {
    var that = this;
    if(typeof data.content == 'string'){
      var content = JSON.parse(data.content);
    }
    console.log(content);
    // var message = new Object();
    var id = content.msg.id;
    if (data.type == 1 && content.msg.userId != app.globalData.userInfo.id && content.msg.chatroomId == that.data.chatroomId) {
      content.msg.msg = JSON.parse(content.msg.msg);
      that.data.messageList.push(content);
      that.setData({
        messageList: that.data.messageList,
        lastMessageId: 'msg_' + id
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载0
   */
  onLoad: function (options) {
    if (options.wedding_company && options.wedding_mc) {
      this.setData({
        haveMc: true
      })
    }
    wx.showLoading({
      title: '加载中...',
      duration: 60000,
    })
    this.data.Card_Id = options.wedding_id;
    this.data.chatroomId = options.chatroomid;
    this.getSystemInfo();
    this.getChatRoomMsgList();
    controller.init(this.initPage, this.getdata, this.broadcast);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    if (!that.pageReady) {
      that.pageReady = true;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
console.log(0);
    if (this.pageReady) {

    }
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

  },



  // connect: function() {
  //   var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl);    //创建信道 //var tunnel = new Tunnel(tunnelUrl)
  //   console.log(tunnel)
  //   tunnel.on("1",()=>{console.log('信道连接')});

  //   // tunnel.on(1,speak =>{
  //   //   const{word,who} = speak;
  //   //   console.log(speak);
  //   //   this.pushMessage(createUserMessage(word,who,))
  //   // });

  //   tunnel.on('close',() => {
  //     console.log("关闭连接");
  //   });

  //   tunnel.on('socket', socket=>console.log(socket));

  //   //重连提醒
  //   tunnel.on('reconnecting', ()=>{
  //     console.log('重连');
  //   });

  //   tunnel.on('reconnect',() => {
  //     console.log('重连成功');
  //   });

  //   tunnel.open();
  // },

  // //退出聊天室
  // quit: function () {
  //   if(this.tunnel){
  //     this.tunnel.close();
  //   }
  // },

  //追加一条消息
  // pushMessage(message){
  //   var that = this;
  //   var id = this.data.messageList[this.data.messageList.length-1].msg.id + 1
  //   message.msg.id = id;
  //   console.log(message)
  //   this.data.messageList.push(message);
  //   console.log(this.data.messageList)
  //   that.setData({
  //     messageList: this.data.messageList,
  //     lastMessageId: 'msg_' + id
  //   })
  // }
})