window.GameMsgGlobal = {
    Net: {
        DisConn: 'GameMsgGlobal_Net_DisConn', //在NetMaskModule中添加监听事件
        TimeOut: 'GameMsgGlobal_Net_TimeOut', //在NetMaskModule中添加监听事件   
        MsgErr: 'GameMsgGlobal_Net_MsgErr' //在Observer中添加监听
    },

    NetCode: {
        SuccessHttp: {
            id: 200,
            msg: '成功'
        }
    }
}