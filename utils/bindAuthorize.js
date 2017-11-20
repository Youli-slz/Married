function authorizeLocation() {
    wx.getSetting({
        success(res) {
            if(!res.authSetting['scope.userLocation']) {
                wx.authorize({
                    scope: 'scope.userLoaction',
                    success () {
                        return 'success';
                    }
                })
            } else {
                return 'success';
            }
        }
    })
}

module.exports = {
  LOCATION: authorizeLocation
}


//  获取授权消息