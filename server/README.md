MergeGame服务端接口
======
1.注册登录

>接口：register

>参数：userId

>返回：errcode:0成功，9001存在多个账号

    {
        msgId: 1001,
        errcode: 0,
        errmsg:'ok'
        data: {userid:'11232131', gold:0, diamond:0, historyGold:0, medal: 0, level:0}
    }