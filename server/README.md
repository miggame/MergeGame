MergeGame服务端接口
======
1.注册登录

>接口：register

>参数：{userId:userId}

>返回：errcode:0成功，9001存在多个账号, parkArr[i].status:0船位空闲，1占用， 2在跑道上，-1可点击购买船位按钮

    {
        msgId: 1001,
        errcode: 0,
        errmsg:'ok'
        data: {
            userid:'11232131',
            gold:0, 
            diamond:0, 
            historyGold:0, 
            medal: 0, 
            level:0,
            parkArr:[{index:0, status:-1/0/1/2, level:0}] 
            }
    }



2.七日登录---废弃删除

>接口：sevenDay

>参数：{userId:userId}

>返回：errcode:0成功，9002内部错误

    {
        msgId:2001,
        errcode:0,
        errmsg:'ok',
        data:{sevenDay:[1, 0, 0, 0, 0, 0, 0],sumDay:1, sevenDayReward:{} }
    }


3.更新七日登录

>接口：updateSevenDay

>参数：{userId:'111111, index:1}

>返回：errcode:0成功，9002内部错误

    {
        msgId:2002,
        errcode:0,
        errmsg:'ok',
        data:[2, 0, 0, 0, 0, 0, 0] 
    }


4.兑换勋章

>接口：exchangeMedal

>参数：{userId:'111', gold:100, medal:1} //gold, medal 有正负

>返回：errcode:0成功

    {
        msgId:3001,
        errcode:0,
        errmsg:'ok',
        data:{gold:100, medal:1}
    }


5.船位状态更新（status:0空闲，1占有，2在跑道，3船位增加按钮)


>接口：updateParkStatus

>参数：{userId:'111', index:1, level:1, status:1} 

>返回：errcode:0成功

    {
        msgId:4001,
        errcode:0,
        errmsg:'ok',
        data:[parkArr]
    }


6.请求掉出
>接口：requestDropBoat

>参数：{userId:'111'}

>返回：errcode:0成功

    {
        msgId:5001,
        errcode:0,
        errmsg:'ok'
        data:
    }



