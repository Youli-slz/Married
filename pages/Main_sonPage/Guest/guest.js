// pages/Main_sonPage/Guest/guest.js
var wxSortPickerView = require('../../../components/wxSortPickerView/wxSortPickerView.js');
var sq = require('../../../utils/sRequest.js');

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
  },

  //获取宾客列表
  getguestList: function () {
    var that = this;

    sq.POST({
      url: '/socket/response.do',
      servername: "logic",
      params:{
        action_name: 'get_guest_list',
        data:{
          card_id: 18            //parseInt(that.data.Card_id)
        }
      },
      success: function (res) {
        console.log(res);
        wxSortPickerView.init(res.guest_list,that);
        that.setData({
          admin_list: res.admin_list,
          guest_list: res.guest_list
        })
      }
    })
  },

  //改变宾客角色
  changeRole: function (e) {
    console.log(e)
    var that = this;
    console.log(this.data.RoleType[e.detail.value].id);
    var status_id = this.data.RoleType[e.detail.value].id;
    sq.POST({
      url:'/socket/response.do',
      servername: "logic",
      params:{
        action_name: 'set_user_status',
        data:{
          card_id: 18,             //that.data.Card_id,
          user_id: e.currentTarget.dataset.id,
          status: that.data.RoleType[e.detail.value].id,
        }
      },
      success:function(res) {
        that.getguestList();
        wx.showToast({
          title:'设置成功',
          icon:'success',
          duration:1500
        })
      },
      failure: function (res) {
        console.log(res)
      }
    })
  },

  //跳转到宾客统计列表
  toStatistic: function () {
    wx.navigateTo({
      url:'../statistic_guest/statistic_guest'
    })
  },

  //搜索宾客
  searchGuest: function (e){
    console.log(e.detail.value);
  },

    wxSortPickerViewItemTap: function(e){
    console.log(e.target.dataset.text);
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