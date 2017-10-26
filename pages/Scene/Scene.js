var wxSortPickerView = require('../../components/wxSortPickerView/wxSortPickerView.js');
var sq = require('../../utils/sRequest.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    voiceUrl: '',
    isSpeaking: false,
    windowHeight: null,
    winWidth: null,
    winHeight: null,
    isFunction: false,
    istape: false,
    showList: false,
    admin_list:[],
  },

  // 右侧显示宾客列表
  ShowGuest: function () {
    var that = this;
    this.setData({
      showList: !that.data.showList,
    })
  },

  // 点击留言栏关闭功能栏
  hidden_fun_box: function () {
    if(this.data.isFunction){
      this.setData({
        isFunction: false,
        winHeight: this.data.winHeight+this.data.windowHeight*0.2,
      })
    }
  },

  //展示更多里面的功能栏
  showMore: function () {
    var height;
    if(!this.data.isFunction){
       height = this.data.winHeight-this.data.windowHeight*0.2;
    } else {
       height = this.data.winHeight+this.data.windowHeight*0.2;
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
  touchdown:function () {
    console.log('按住了按钮')
    var that = this;
    that.setData({
      isSpeaking: true,            //显示录音中的图片
    });

    wx.startRecord({
      success: function (res) {
        var tempFilePath = res.tempFilePath
        console.log(tempFilePath);
        wx.playVoice({
          filePath: tempFilePath,
          complete: function(){
          }
        })
        that.setData({
          voiceUrl: tempFilePath,
        })
        // sq.Upload({
        //   type: 2,
        //   filePaths: res.tempFilePath,
        //   success: function(res){
        //     console.log(res);
        //     that.setData({
        //        voiceUrl: res.imageURL
        //     })
        //   }
        // })
      },
      fail: function(res){
        wx.showToaset({
          title:'录音失败',
          icon:'',
          duration: 1200
        })
      }
    })
  },

  toplay:function () {
    var that = this;
    console.log(that.data.voiceUrl);
    wx.playVoice({ 
      filePath: that.data.voiceUrl, 
      success: function () { 
        wx.showToast({ 
          title: '播放结束', 
          icon: 'success', 
          duration: 1000 
        }) 
      },
      fail:function (res) {
          console.log(res);
      }
    }) 
  },

  //按钮松开 取消录音
  touchup: function () {
     console.log("松开了按钮")
     var that = this;
     wx.stopRecord();
     that.setData({
       isSpeaking: false,
     })
  },

  //获取设备信息
  getSystemInfo: function() {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight*(1- 0.15),
          windowHeight: res.windowHeight,
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo();
    var that = this
    wxSortPickerView.init(that.data.admin_list,that);
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