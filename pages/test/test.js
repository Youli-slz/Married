// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webSrc:'',   //https://logic.hunlibaoapp.com/wedding/wedding.html?card_id=NzE0Njk4N2ZpcmVfY2xvdWQ&type=app&edit=1
    pagetype: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var linkUrl;
    if(options.edit){
      linkUrl=options.preview_link + '?card_id='+ options.card_id + '&edit='+options.edit
    } else {
      linkUrl = options.preview_link + '?card_id=' +options.card_id
    }
    if(options.groom){
      linkUrl = options.preview_link + '?card_id=' +options.card_id + '&edit=' + options.edit + '&groom=' + options.groom +'&bride='+ options.bride +'&site=' +options.site +'&time='+ options.time
      console.log(linkUrl)
    }
    this.setData({
      webSrc: linkUrl,
      pagetype:　options.pagetype
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