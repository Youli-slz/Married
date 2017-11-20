// pages/Main_sonPage/Guest/guest.js
var constants = require('../../../static/ProtocolType.js')
var wxSortPickerView = require('../../../components/wxSortPickerView/wxSortPickerView.js');
var controller = require('../../../utils/controller_onec.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Card_id: null,
    RoleType:[
      {
        id:2,
        name:'新郎'
      },
      {
        id:3,
        name:"新娘",
      },{
        id:4,
        name:"管理员"
      },{
        id:5,
        name:"宾客"
      }
    ],
    admin_list:[],
    guest_list:[],
    zimu_list:[],
    searchList:[],
    showsearch: false,
    inputValue: ''
  },

  //获取宾客列表
  getguestList: function () {
    var that = this;

    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.GET_GUEST_LIST,
      data:{
        action_name: 'get_guest_list',
        data:{
          card_id: parseInt(that.data.Card_id)
        }
      }
    })
  },

  //获取宾客列表数据
  getGuestData: function (data) {
    var that = this;
    if(data.code == 0){
      wxSortPickerView.init(data.data.guest_list, that);
      that.setData({
        admin_list: data.data.admin_list,
        guest_list: data.data.guest_list
      })
    } else {
      wx.showToast({
        title: data.msg,
        duration: 2000
      })
    }
  },

  //改变宾客角色
  changeRole: function (e) {
    console.log(e)
    var that = this;
    console.log(this.data.RoleType[e.detail.value].id);
    var status_id = this.data.RoleType[e.detail.value].id;
    controller.REQUEST({
      servername: constants.CONTANT_SERVER_NAME,
      methodname: constants.SET_USER_STATUS,
      data:{
        action_name: 'set_user_status',
        data:{
          card_id: that.data.Card_id,
          user_id: e.currentTarget.dataset.id,
          status: that.data.RoleType[e.detail.value].id,
        }
      }
    })
  },

  //改变宾客成功
  changeRoleData: function (data) {
    if(data.code == 0){
      this.getguestList();
      wx.showToast({
        title: '设置成功',
        icon: 'success',
        duration: 1500
      })
    } else {
      wx.showToast({
        title: data.msg,
        duration: 1500
      })
    }
  },

  //跳转到宾客统计列表
  toStatistic: function () {
    wx.navigateTo({
      url:'../statistic_guest/statistic_guest?wedding_id=' + this.data.Card_id
    })
  },

  //搜索宾客
  searchGuest: function (e){
    var that = this;
    this.data.searchList = [];
    var re = new RegExp("^.*"+ e.detail.value +".*$");    //正则匹配，匹配其中带有e.detail.value中值的任何字符串
    for(var i = 0; i< that.data.guest_list.length; i++){
      if(that.data.guest_list[i].nick_name.match(re)){
        that.data.searchList.push(that.data.guest_list[i]);
        console.log(that.data.guest_list[i]);
      }
    }
    console.log(that.data.searchList)
    that.setData({
      showsearch: true,
      searchList: that.data.searchList
    })
  },

    wxSortPickerViewItemTap: function(e){
    console.log(e.target.dataset.text);
  },

  //取消搜索页面
  showsearchList: function () {
    this.setData({
      showsearch: false,
      searchList: [],
      inputValue: ''
    })
  },

  //从信道获取数据
  getdata: function (server, method, data){
    var that = this;
    if(typeof server == 'string'){
      var ProtocolData = JSON.parse(data);
      switch (method){
        case constants.GET_GUEST_LIST:
          that.getGuestData(ProtocolData);
          break;
        case constants.SET_USER_STATUS: 
          that.changeRoleData(ProtocolData);
          break;
      }
    } else {
      console.log(server);
    }
  },

  //初始化页面请求
  initPage: function () {
    var that = this;
    that.getguestList();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      Card_id: options.wedding_id
    })
    that.getguestList();
    controller.init(this.initPage, this.getdata,)
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