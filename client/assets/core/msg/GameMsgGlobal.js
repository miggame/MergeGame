window.GameMsgGlobal = {
    Net: {
        DisConn: 'GameMsgGlobal_Net_DisConn', //在NetMaskModule中添加监听事件
        TimeOut: 'GameMsgGlobal_Net_TimeOut', //在NetMaskModule中添加监听事件   
        MsgErr: 'GameMsgGlobal_Net_MsgErr', //在Observer中添加监听
        Send: "GameGlobal_Net_Send", //在NetMaskModule中添加了监听事件
        Recv: "GameGlobal_Net_Recv", //在NetMaskModule中添加了监听事件
    },

    NetCode: {
        SuccessHttp: {
            id: 0,
            msg: '成功'
        }
    }
}