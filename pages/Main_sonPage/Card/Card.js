var constants = require('../../../static/ProtocolType.js');
var controller = require('../../../utils/controller_onec.js');
var app = getApp();

Page({
  
    /**
     * 页面的初始数据
     */
    data: {
      Card_Id: null,
      user_role: null,
      Card_list: [],                     //创建的请帖
    },
  
    Create_card: function () {
      wx.navigateTo({
        url:'../Create_Card/Create?wedding_id=' + this.data.Card_Id
      })
    },
  
    delete_Card:function(e) {
      var that = this;
      var id = e.currentTarget.dataset.id;
  
      wx.showModal({
        title: '提示',
        content:'确定删除该请帖吗？',
        success: function (res) {
          if(res.confirm){
            console.log('删除'+id+'这个请帖');
            controller.REQUEST({
              servername: constants.CONTANT_SERVER_NAME,
              methodname: constants.DELETE_CARD_TEMPLATE,
              data:{
                action_name: 'del_card_template',
                data:{
                  template_id: parseInt(id)
                }
              }
            })
          }else {
            console.log('取消删除')
          }
        }
      })
    },

    /**
     * 获取请求删除请帖返回的数据
    */
    getDeleteData: function (data) {
      var that = this;
      if(data.code == 0){
        wx.showToast({
          title: '删除成功',
          duration: 1500,
        })
        that.getUserCard();
      }else {
        wx.showToast({
          title: data.msg,
          image: '../../../assets/image/cuo.png',
          duration: 2000
        })
      }
    },

    /**
     * 点击预览
     */
    previewCard: function (e) {
      console.log(e.currentTarget.dataset.templateid);
      wx.navigateTo({
        url: '../../ToCard/tocard?templateId=' + e.currentTarget.dataset.templateid + '&type=2'+ '&edit=1' + '&userId=' + app.globalData.userInfo.id + '&weddingId=' + this.data.Card_Id
      })
    },

    /**
     * 请求请帖列表
    */
    getUserCard : function (){
      var that = this;
      controller.REQUEST({
        servername: constants.CONTANT_SERVER_NAME,
        methodname: constants.GET_MY_CARD_TEMPLATE_LIST,
        data:{
          action_name: 'get_user_template_list',
          data:{
            user_id: app.globalData.userInfo.id
          }
        }
      })
    },

    /**
     * 获取请求到的请帖数据
    */
    getMyCardList: function (data) {
      if(data.code == 0){
        this.setData({
          Card_list: data.data,
        })
      }else {
        wx.showToast({
          title: data.msg,
          image: '../../../assets/image/cuo.png',
          duration: 2000
        })
      }
    },
  
    /**
     * 初始化请求
    */
    initPage: function () {
      this.getUserCard();
    },

    /**
     * 请求后获取的数据
    */
    getdata: function (server, method, data) {
      var that = this;
      var ProtocolData = JSON.parse(data);
      if(typeof server == 'string'){
        switch(method){
          case constants.GET_MY_CARD_TEMPLATE_LIST:
            that.getMyCardList(ProtocolData);
            break;
          case constants.DELETE_CARD_TEMPLATE:
            that.getDeleteData(ProtocolData);
            break;
        }
      }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      console.log('请帖id   '+ options.wedding_id)
      controller.init(this.initPage, this.getdata, );
      this.setData({
        Card_Id: options.wedding_id,
        user_role: options.role
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
      this.getUserCard();
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