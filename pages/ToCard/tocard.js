var Host = 'https://logic.hunlibaoapp.com/wedding/wedding.html'
var app = getApp();

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
   * options{
   * @templateId    //请帖模板id
   * @Ttype         //请帖列别
   * @edit          //是否编辑
   * @userId        //用户id
   * @weddingId     //婚礼id
   * @imgStr        //修改的数据
   * }
   */
  onLoad: function (options) {
    var linkUrl;
    if(options.type == '1'){
      linkUrl = Host + '?card_id=' + options.templateId +  '&Ttype=1'
    } else {
      if(options.edit == 1){
        linkUrl = Host + '?card_id=' + options.templateId + '&Ttype=2'+ '&edit=1'+ '&userId='+ options.userId + '&weddingId=' + options.weddingId
      } else {
        linkUrl = Host + '?card_id=' + options.templateId + '&Ttype=2' + '&userId=' + options.userId + '&weddingId=' + options.weddingId
      }
    }
    if(options.imgStr){
      linkUrl = '';
      linkUrl = Host + '?card_id=' + options.templateId + '&Ttype=2'+ '&edit=1'+ '&userId='+ options.userId + '&weddingId=' + options.weddingId + '&imgStr=' + options.imgStr
      console.log(linkUrl);
    }
    // if(options.groom){
    //   linkUrl = options.preview_link + '?card_id=' +options.card_id + '&edit=' + options.edit + '&groom=' + options.groom +'&bride='+ options.bride +'&site=' +options.site +'&time='+ options.time
    //   console.log(linkUrl)
    // }
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