var socket = require('../utils/init.js');
var sq = require('../utils/sRequest.js');

var broadcastController;
var messageController;
var InitController;
var isconnect = 0;
var errorMsg={code : '', msg: ''}

// var requestParams;

    function initController(iCallback,mCallback, bCallback) {
        InitController = iCallback;
        messageController = mCallback;
        broadcastController = bCallback;
        socket.connectStatus(connectmessage);
    }

    function Request ( params ) {
        if((!socket.tunnel && isconnect == 0) || (socket.tunnel.status == 'CLOSED')){
            console.log('信道关闭或没有信道')
            isconnect = 1;
            socket.CONNECT();
            InitController();
        } else {
            sq.FunType(params);
        }
 
    }

    function message (server, method, data) {
        // console.log(server,method, data);
        messageController(server, method, data);
    }

    function broadcast(data){
        broadcastController(data);
    }

    // 判断信道连接方法
    function connectmessage( connect_message) {
        errorMsg = connect_message;
        if(connect_message.code == 0){
            // sq.FunType(requestParams);
            socket.initnetwork(message,broadcast);
        } else if(connect_message.code == 1){
            InitController()
        } else if (connect_message.code == 3){
            isconnect = 0;
        }else if(connect_message.code == 2){
            setTimeout(function () {
               socket.CONNECT();
               InitController();
            },30000)

            messageController(connect_message.msg)
        }
    }


module.exports = {
        init: initController,
        REQUEST: Request
}

//控制器通过回调函数 返回数据 判断数据