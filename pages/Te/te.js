//index.js
//获取应用实例
var sq = require('../../utils/sRequest.js');
var login = require('../../utils/login.js');
var QQMapWX = require('../../static/qqmap-wx-jssdk.js');

import  { $WxDialog ,$WxToast, $WxLoading, $WxHover_Btn, $WxPickerCity} from '../../components/wx';

const app = getApp()

var showsuccess = (data,content) => {
  console.log(data);
wx.showToast({
  title: '成功',
  icon: 'success'
});
}

var showfail = (error) => {
  console.log(error);
}

Page({
  data: {
    getdata: null,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    index: 3, 
    opened: !1,
    city: '',
    inputValue:  '',
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'     
    ]
  },

  onShareAppMessage: function () {
    return {
      title: '微信小程序联盟',
      desc: '分享测试!',
      path: '/pages/index/index'
    }
  },

  chooseimage: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ["original", 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res){
        var tempFilePaths = res.tempFilePaths;
        sq.Upload({
          filePaths: tempFilePaths,
          success:function (res) {
            console.log(res);
          }
        });
      }
    })
  },
  
    Login:function() {
      login.LOGIN();
    } ,
    goadd: function () {
    wx.navigateTo({
      url: '../Main_sonPage/CashGifts/cashgifts',
    })
      // wx.navigateTo({
      //   url: '../Main_sonPage/balance/balance'
      // })
  },
  //事件处理函数
  bindViewTap: function() {
    console.log(getCurrentPages()[getCurrentPages().length - 1]);
  },

    shuru: function () {
      console.log("已发送")
    },
  test: function () {
      // var uInfo = wx.getStorageSync('weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A');

      // console.log(uInfo);
    // console.log(app.globalData)
    sq.POST({
        url: '/socket/response.do',      
        params: {
            action_name: "upload_token",
            data:"upload_token"
        },
        servername: 'logic',
    
        success: function (data){
        console.log(data);
      },
    //   failure: function(msg){      // 可以传 也可以不传
    //     console.log(msg);
    //   }
    })
  },





  /**
   * 打开指定地图点
  */
openaddress: function (){
  wx.openLocation({
    latitude: 30.30551,
    longitude: 120.331,
    scale: 16
  })
},

  /**
   * 地图
  */
    getAddr: function(){
    var that = this;
    wx.chooseLocation({
    success: function(res){
    // var point = {
    // latitude: res.latitude,
    // longitude: res.longitude
    // };
    console.log(res);
    // console.log(res.name)
    that.setData({
    address : res.name + res.address + ' ' + res.latitude + ' ' + res.longitude
    });
  }
})
},

   /**
    * 腾讯地图api
   */
  bindKeyInput: function (e) {
    this.setData({
        inputValue: e.detail.value
    })
  },
  getaddress: function (){
    var demo = new QQMapWX({
        key:'PDDBZ-NF5AQ-W5Q5Z-G4M35-CG2S2-2BFUK'
    })

    demo.geocoder({
        address: this.data.inputValue,
        success: function (res) {
            console.log(res);
        },
        fail: function (res){
            console.log(res)
        },
        complete: function (res) {
            console.log(res)
        }
    })
  },


	onTapCity: function () {
		$WxPickerCity.init('city', {
			title: '请选择目的地', 
			value: [8, 0, 11],
		    onChange(p) {
		    	// console.log(p.value)
				this.setData({
					city: p.value.join(' ')
				})
			},
		})
	},


	showLoading() {
		$WxLoading.show({
			text: '数据加载中',
		})

		setTimeout(() => {
            $WxLoading.hide()
        }, 1500)
  },
      
	showToast() {
		$WxToast.show({
			type: 'success',
			timer: 1500,
			color: '#fff',
			text: '已完成',
			success: () => console.log('已完成')
		})
	},

confirm: function() {
  $WxDialog.confirm({
    title: '公共弹窗',
    content: 'just ceshi , you know?',
    onConfirm(e){
      console.log('确定');
    },
    onCancel(e){
      console.log('取消');
    }
  })
},


	prompt: function () {
		const that = this
		const alert = (content) => {
			$WxDialog.alert({
				title: '提示', 
				content: content, 
			})
		}

		$WxDialog.prompt({
			title: '提示', 
			content: '密码为8位数字', 
			fieldtype: 'number', 
			password: !0, 
			defaultText: '', 
			placeholder: '请输入Wi-Fi密码', 
			maxlength: 8, 
			onConfirm(e) {
				const value = that.data.$wux.dialog.prompt.response
				const content = value.length === 8 ? `Wi-Fi密码到手了: ${value}` : `请输入正确的Wi-Fi密码`
				alert(content)
			},
		})
  },

  prompt__ta: function () {
    const that = this;
    const alert = (content) => {
      $WxDialog.alert({
        title: '提示',
        content: "内容不能为空",
      })
    }

    $WxDialog.prompt_textarea({
      title: '提示',
      defaultText: '',
      placeholder: '请留言...',
      maxlength: 100,
      onConfirm(e) {
        const value = that.data.$wux.dialog.prompt.response;
        const content = value.length >0 ? `` : alert('请输入感想')
      }
    })
  },

  //悬浮按钮
	initButton(position = 'bottomRight') {
		this.setData({
			opened: !1, 
		})
		this.button = $WxHover_Btn.init('br', {
      position: position, 
      switch: {
        label: '弹幕'
      },
			buttons: [
				{
					label: '游戏', 
					icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAOGSURBVGje7VhLSFVRFF1HLROtLHtmhVJmz0c/NUstoQ84KAuSauKkdJDQh2pghRAFkTQwiKIoMppFk0ALKioKggbmQEJCsAQjKIMc9Ochymqg73Pf3ed+n4PgreG+e6+1zn7nnbvPBVJI4X8Dq3iOA5Twhq1cPZ3S63mPTnCNoeSL1/OnI/EIBrgpeeKVHHElHkEPV/gXz+QVT+IRnKLyIx/kuC/5yR+jwKt8nW/xCMq8yO9NmjxJ1rqV351UeZKsciNfk3R5kiyWtIQ9ygKMeNw21pjAHPU3MZhmkk/Do4TQHzz3IBfGg4RIOq47af9BU+uOAADX8q7jZrdzEQAIFXV28vkCXWn0aYB34uIf+ZJd7OYrfomLXmRWNH+nwDbL2kCnUJJjyNjIowyKtRU8zVWGSLHAdsJKvlBs6EwPO0Dfz4QFGTdhq8gzw6sByO1u1PnN1mypIDxCe5jHLTu+A1s1PPs8d6BFE18p+32i8ZvvuQMhDeMFKXmmJnmz5/UD4H6RM0whtURM7fUjDzBds6y5kYzYHlgjMrT5M6AmcEh8sMxsoFJM9NkBAE/FaHRujhkoFxN/+TYgv1kFA6VC2mc/E+UUxsToUrMBaXQc968PitGA2YB0bOYlwUCaGM00Pw4LaTm+pvoEKQOiajEDX8XEbN8GAmJ01GzgvZgoDpKuIN8Jhs0G3oqJDb4NHBCjg6YI92gOzXQ/6pytYS03d6Bfw7Hd1/qbNPFhU0T7NkwYoVytf4mGcSx2OEQ7oMbwTMPTRU9DGXO1Xe0Q/93cpe1BHxe6lg9RD/nNq50JJ3HMeR84nx2WXGm6wqtxSWeFbyOddvMRFXfwIa3Roi+Pvxf0s5gZPC9SfBJqGzlKZ7Da1LxlSN0AsE2gaBfX/tiR/HHrFgYS0ucxg79NJOIbgkWODFjfDQE2G9JvAgwmUHRrKsEftvLb7Hew4mtDSR7A5fwQF2nW1tp9Sb1hKw8AXGAoOjkVzeUWVttUXraU/27b/ijROkOh47eBjYEipzwAWG8ovW+3dgcGKlzIAwAbtFRNHgzU6Gp0hyJUN3Tfc9zPiWWqx7UBQL1AyG2NgCEsVv36x5ZkahBZMP913MxIZxBUll8dbVajwuowqvHNk4E+hFS7onWSg3aqXpWP+tggbXFfit0t3qFWVapBJBMs422SQ7G7vSmjkGGSl1iSVOEUUphe/AMv8ctn/pO1zAAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNy0wNC0wNFQxMDo0MDo0MiswODowMNlOhSIAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTctMDQtMDRUMTA6NDA6NDIrMDg6MDCoEz2eAAAAAElFTkSuQmCC", 
				},
				{
					label: '红包', 
					icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAM3SURBVGje7VlNSBRRHP8/tU1dd7PNwkwiUqFIb5pGlJZEardIsOwi5iU6SF+XDhVBRFFJdKlbH0hdgkBIO3kptSKiEgKJWAikQrKgxLD9dZB982b2zex7b2ZZof2f/sv+vuYx8z5mGBkVYtRGzdRI1RSmWfpAYzRKI2zeTE3POorTcKtZ9KAgk+YRXEP6OoH8zNgfUDBPVnPQ5kUY1LAHgEvIC86+HDMO+UkcQpEt4EG8dWAmEAnGvtIh/Bg1LsgqPLIhZ7DSv32pw357Gvw2GzqOQn/2DKO2ay9R4JRgSODc8xegS5C6CPXYVwXeHnP7kCBzXYtJuM2ZC8bPA1q5yGfdGQ4hzHN2vTvOO1s37/azBb0A7A91WGzTEfjCr8FgckUhZ78ysycu8NuIzzh/2h0V3HRpWLkAuQC5ALkASzkAI0oeNIpUdwIu9ct0BKZ4Z3LcCPEubhrAWsVWGAQo5d070wDPebfJIIC1d35tGuAl7zpIv1p598aATUSEMF/R/+rfhvjG2Qp7aTeR91xkgyZzjXU28MKlmwesvfBhzeztvBswvn4irBU25iENHsN3ztvoIwARJrlQtwaribPmfE5iaBfGIKrIyUOcc3r8+RMKhAB3FDl9AifsMwAROgS5Ywr4RgF/1Lc9Ech2Qj6VBt0kYOewLIAAtmcaAPo9kLttyNpA7ImIUG8TdlmabKdpoDMweyIi7BCkm1wwmwVMr5qu4o4IMWoRfrpNScuFPiG+xPJ37eW4DHtVuiBXOXD9qjOHu/l63IKzRjzwD1PQZ1Fmal6DB0itYa/FFWE8k3AGUKFrXodhqXmdAncXPkm4dxUXJRAaMCERGES1cnzCVryQaAxhizeRYSemJMSbbredp1otnki0xtEgXR+Rj7aUN8IAcAGr9c25ahXuSzQ/ogXMPmRHIKuTMNmOO0Osww2J9k/sTQIiGJcA+lDs35yHKMN5iUccFYQSfE35o0tn+6UcIorjqRnIMTw/sC9DH1wWQxSj1xnAqjk0226NTIUIoRPTsgD+Py6oh4glTRmSD2WCZXDoUwIwSix2S/kFxX8SwLoHsjYCY9kOcC7LAdhTupJF/zP/AOvS/D0NTmDBAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE3LTA0LTA0VDExOjQ3OjQ1KzA4OjAwI6N5UAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNy0wNC0wNFQxMTo0Nzo0NSswODowMFL+wewAAAAASUVORK5CYII=", 
				},
				{
					label: '祝福', 
					icon: "data:image/png;base64,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", 
				}
      ],
      switchClicked(e){
        console.log(e.detail.value);
      },
			buttonClicked(index, item) {
				index === 0 && wx.showModal({
					title: 'Thank you for your support!', 
					showCancel: !1, 
				})

				index === 1 && wx.showModal({
					title: '第二个按钮',
					showCancel: !1,
				})

				index === 2 && wx.showModal({
					title: '第三个按钮',
					showCancel: true,
				})

				return true
      },
      
			callback(vm, opened) {
				vm.setData({
					opened, 
				})
			},
		})
  },
  
  tiaozhuan: function () {
      wx.navigateTo({
          url: '../red_packet/red_packet'
      })
  },

  methodofcanshu: function (e) {
    console.log(e.target.dataset);                // 获取页面中方法传的参数
  },

  onLoad: function () {
    this.initButton();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    // var myAmapFun = new amapFile.AMapWX({ key: '031f5f532ca4c8c470d39f625c15bb3b'});
    // myAmapFun.getRegeo({
    //   success: function (data) {
    //     console.log(data);
    //   },
    //   fail: function (info) {
    //     console.log(info);
    //   }
    // })




  },
  getUserInfo: function() {
    console.log()
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  }
})


