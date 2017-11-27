
var qcloud = require('../static/bower_components/wafer-client-sdk/index');
var config = require('../config.js');
var backData;
var messageCallback;
var broadcastCallback;
var connectCallback;     // 信道连接信息
var connect_Status;

// 信道连接状态
var CONNECT_SUCCESS = 0;
var CONNECT_RESTART = 1;
var CONNECT_ERR = 2;
var CONNECT_CLOSE = 3;

// 信道连接关系

    function connect () {
        console.log('开始连接')
        var tunnel = this.tunnel =  new qcloud.Tunnel(config.service.tunnelUrl);
        tunnel.on("close", () => {
            console.log('信道关闭');
            connect_Status = {code: CONNECT_CLOSE, msg: '信道关闭'};
            connectStatus( connect_Status );
        })

        tunnel.on("connect", () => {
            console.log('信道连接');
            connect_Status = {code: CONNECT_SUCCESS, msg:''};
            connectStatus( connect_Status );
        });

        tunnel.on('reconnecting', () => {
            console.log('重连中');
            // wx.showLoading({
            //     title: '重连中...',
            //     mask: true
            // })
            connect_Status = {code: CONNECT_RESTART, msg:'信道重连中'};
            connectStatus( connect_Status );
        });

        tunnel.on('reconnect',() => {
            console.log('重连成功');
            wx.hideLoading();
            connect_Status = {code: CONNECT_SUCCESS, msg:''};
            connectStatus( connect_Status );
        });

        tunnel.on('error', error => {
            console.log(error);
            connect_Status = {code: CONNECT_ERR, msg: error};
            connectStatus( connect_Status );
        })

        tunnel.on('socket', socket => { protoParse(socket);});
        tunnel.on( 'broadcast' , broadcast => { broadcastParse(broadcast)});

        tunnel.open();
    } 

    function protoParse (val) {
        // console.log(val.servername);
        
        messageCallback(val.servername, val.methodname, val.data);
    }

    //广播的callback
    function broadcastParse (val) {
        // console.log(val.type);
        broadcastCallback(val);
    }


    function initNetwork(mCallback, bCallback) {
        // connect();
        messageCallback = mCallback;     //普通请求回调
        broadcastCallback = bCallback;    // 广播请求回调
    }


    function connectStatus ( message ) {
        connectCallback(message);
    }

    function connectCallBack ( connectmessage ){
        connectCallback = connectmessage;
    }

module.exports = {
        CONNECT:  connect,
        initnetwork: initNetwork,
        connectStatus: connectCallBack,
}

