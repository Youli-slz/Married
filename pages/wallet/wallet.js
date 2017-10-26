// pages/wallet/wallet.js
var sq = require('../../utils/sRequest.js');
var uInfo;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Balance: null,
    selectArea: '',
    showlist: false,
  },

  /**
   * 显示列表的操作
  */
  showdetail: function () {
    this.setData({
      showlist: !this.data.showlist,
    })
    if(!this.data.selectArea){
      this.setData({
        selectArea: 'rotateRight',
      })
    } else if(this.data.selectArea == 'rotateRight') {
      this.setData({
        selectArea: 'rotateLeft',
      })
    } else {
      this.setData({
        selectArea: 'rotateRight',
      })
    }
    console.log(this.data.showlist)

  },

  /**
   * to 提现页面
  */
  toReflect: function () {
    wx.navigateTo({
      url:'../Reflect/Reflect'
    })
  },

  /**
   * 获取账户余额
  */
  getbalance: function () {
    var that = this;
    sq.POST({
      url: '/socket/response.do',
      servername: ' logic',
      params:{
        action_name: 'get_balance',
        data: {
          user_id: uInfo.id,
        }
      },
      success: function (res) {
        console.log(res);
        that.setData({
          Balance: res,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    uInfo = wx.getStorageSync('USER_INFO');
    that.getbalance();
  
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