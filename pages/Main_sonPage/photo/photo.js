var sq = require('../../../utils/sRequest.js');
var page_num = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseMethod: [
      '图片',
      '视频'
    ],
    ischange: false,
    doommList: [
    ],
    isdelect: false,
    isselect: false,
    num: 2,
    photoList: [],                 // 显示到页面的相册列表
    selectIndex: [],              // 选择的图片的 index
    selectNum: 0,                 // 选中照片数
    wedding_id: null,             // 婚礼id
  },

  //选择图片获取视频上传
  bindPickerChange: function (e) {
    this.data.doommList = [];
    var value = e.detail.value;
    if (value == 0) {
      this.AddImage();
    } else {
      this.AddVideo();
    }
  },
  
  // 添加照片
  AddImage: function () {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        sq.Upload({
          type: 1,
          filePaths: res.tempFilePaths,
          success: function (res) {
            that.data.doommList.push({ type: 1, url: res.imageURL, Num: 2 });
            that.data.photoList.push({ type: 1, url: res.imageURL, Num: 2 });
            that.setData({
              photoList: that.data.photoList,
              ischange: true,
            })
          }
        })
      }
    });
  },

  //添加视频
  AddVideo: function () {
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        sq.Upload({
          type: 2,
          filePaths: res.tempFilePath,
          success: function (res) {

            that.data.doommList.push({ type: 2, url: res.imageURL, Num: 2 });
            that.data.photoList.push({ type: 2, url: res.imageURL, Num: 2 });
            that.setData({
              photoList: that.data.photoList,
              ischange: true,
            })
          }
        })
      }
    })
  },

  //保存图片和视频
  saveImage: function () {
    var that = this;
    var simage = [];
    console.log(that.data.doommList)
    for (var i = 0; i < that.data.doommList.length; i++) {
      delete that.data.doommList[i].Num;
    }
    sq.POST({
      url: '/socket/response.do',
      servername: "image",
      params: {
        action_name: "set_photo_album",
        data: {
          card_id: parseInt(that.data.wedding_id),
          url: that.data.doommList,
        }
      },
      success: function (res) {
        wx.showToast({
          title: "上传成功",
          icon: 'success'
        });
        that.setData({
          ischange: false,
        })
      }
    })
  },

  //修改删除状态
  changeDelect: function () {
    var that = this;

    for (var i = 0; i < that.data.photoList.length; i++) {
      that.data.photoList[i].Num = 2;
    }

    that.setData({
      isdelect: !that.data.isdelect,
      photoList: that.data.photoList,
      selectIndex: [],
      selectNum: 0,
    });
  },

  //删除事件
  Photo_delete: function () {
    var that = this;
    // console.log(this.data.selectIndex);
    sq.POST({
      url: '/socket/response.do',
      servername: "image",
      params: {
        action_name: "del_photo_album",
        data: {
           id: that.data.selectIndex,
        }
      },
      success: function (res) {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        that.setData({
          isdelect: !that.data.isdelect,
          photoList: [],
          selectIndex: [],
          selectNum: 0,
        });
        page_num = 1;
        that.getImgVi(page_num);
      }
    })
  },

  //选择照片事件
  select: function (e) {
    var INDEX = e.currentTarget.dataset.index;
    var ID = e.currentTarget.dataset.id;
    if (this.data.photoList[INDEX].Num == 2) {
      var param = {};
      var string = "photoList[" + INDEX + "].Num";
      param[string] = 1;
      this.setData(param);
      this.data.selectIndex.push(ID);
    } else {
      var param = {};
      var string = "photoList[" + INDEX + "].Num";
      param[string] = 2;
      this.setData(param);
      for (var i = 0; i < this.data.selectIndex.length; i++) {
        if (this.data.selectIndex[i] == ID) {
          this.data.selectIndex.splice(i, 1);
        }
      }
    }
    this.setData({
      selectNum: this.data.selectIndex.length,
    })
  },

  // 封装获取的相册列表
  getList: function (List) {
    // console.log(this.data.doommList)
    for (var i = 0; i < List.length; i++) {
      this.data.photoList.push({id: List[i].id, type: List[i].type, url: List[i].url, Num: 2 })
    }
    this.setData({
      photoList: this.data.photoList,
    })
  },

  //初始化页面获取图片视频列表
  getImgVi: function (val) {
    var that = this;

    sq.POST({
      url: '/socket/response.do',
      servername: "image",
      params:{
        action_name: "get_photo_list",
        data: {
          wedding_id: that.data.wedding_id,
          page_no: val,
          page_size: 20
        }
      },
      success: function (res) {
        if(res != []){
          that.getList(res);
        }
        console.log(res);
      }
    })
  },

  //图片预览
  preview: function (e) {
    var imagelist = []
    for(var i = 0; i < this.data.photoList.length; i++){
      if(this.data.photoList[i].type == '1'){
        imagelist.push(this.data.photoList[i].url)
      }
    }
    wx.previewImage({
      current: e.currentTarget.dataset.url,
      urls: imagelist,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.wedding_id = options.wedding_id;
    page_num = 1;
    this.getImgVi(page_num);
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
    page_num ++;
    this.getImgVi(page_num)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})