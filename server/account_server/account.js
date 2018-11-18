let express = require('express');
let app = express();
let db = require('../db/db');
// let gameData = require('../gameData/gameData');


function send(res, ret) {
    return res.send(JSON.stringify(ret));
}

//设置跨越访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header('X-Powered-By', '3.2.2');
    res.header("Content-Type", "appliction/json;charset=utf-8");
    next();
});

//注册账号
app.get('/register', (req, res) => {
    let reqData = req.query;
    let userId = reqData.userId;
    db.createAccount(userId, (data) => {
        console.log('====data====: ', data);
        let sendData = data;
        let ret = {
            msgId: 1001,
            errcode: 0,
            errmsg: 'ok',
            data: sendData
        };
        if (data === null) {
            ret = {
                msgId: 1001,
                errcode: 9001,
                errmsg: 'exist more than one account',
                data: null
            };
        }
        send(res, ret);
    });
});

//更新七日登录
app.get('/updateSevenDay', (req, res) => {
    let reqData = req.query;
    let userId = reqData.userId;
    let index = reqData.index;
    db.updateSevenDay(userId, index, (data) => {
        let ret = {
            msgId: 2002,
            errcode: 0,
            errmsg: 'ok',
            data: data
        }
        if (data === null) {
            ret = {
                msgId: 2002,
                errcode: 9003,
                errmsg: 'param error',
                data: null
            }
        }
        send(res, ret);
    });
});

//兑换勋章
app.get('/exchangeMedal', (req, res) => {
    let reqData = req.query;
    let userId = reqData.userId;
    let gold = parseInt(reqData.gold);
    let medal = parseInt(reqData.medal);
    db.exchangeMedal(userId, gold, medal, (data) => {
        let ret = {
            msgId: 3001,
            errcode: 0,
            errmsg: 'ok',
            data: data
        };
        if (data === null) {
            ret = {
                msgId: 3001,
                errcode: 9004,
                errmsg: 'interval error',
                data: null
            };
        }
        send(res, ret);
    });
});

//请求掉落船只
app.get('/requestDropBoat', (req, res) => {
    let reqData = req.query;
    let userId = reqData.userId;
    let type = parseInt(reqData.type);
    let num = parseInt(reqData.num);
    db.dropBoat(userId, type, num, (data) => {
        let ret = {
            msgId: 5001,
            errcode: 0,
            errmsg: 'ok',
            data: data
        }
        if (data === null) {
            ret = {
                msgId: 5001,
                errcode: 0,
                errmsg: 'ok',
                data: null
            };
        }
        send(res, ret);
    });
});

//把船推到航道上
app.get('/pushBoatInWay', (req, res) => {
    let reqData = req.query;
    let userId = reqData.userId;
    let index = parseInt(reqData.index);
    db.pushBoatInWay(userId, index, (data) => {
        let ret = {
            msgId: 6001,
            errcode: 0,
            errmsg: 'ok',
            data: data
        }
        send(res, ret);
    });
});

//收回船到船位上
app.get('/pullBoatBackPark', (req, res) => {
    let reqData = req.query;
    let userId = reqData.userId;
    let index = parseInt(reqData.index);
    db.pullBoatBackPark(userId, index, (data) => {
        let ret = {
            msgId: 7001,
            errcode: 0,
            errmsg: 'ok',
            data: data
        }
        send(res, ret);
    });
});

//合并或交换船只
app.get('/mergeBoat', (req, res) => {
    let reqData = req.query;
    let userId = reqData.userId;
    let index1 = parseInt(reqData.index1);
    let index2 = parseInt(reqData.index2);
    db.mergeBoat(userId, index1, index2, (parkArr, flag) => {
        let ret = {
            msgId: 8001,
            errcode: 0,
            errmsg: 'ok',
            data: {
                parkArr: parkArr,
                index1: index1,
                index2: index2,
                flag: flag
            }
        };
        send(res, ret);
    });
});

module.exports = {
    start(config) { //config对应account的配置
        app.listen(config.port);
        console.log('>>>>>account server is listening on <<<<<<', config.host + ':' + config.port);
    }
}