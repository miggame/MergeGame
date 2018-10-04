let express = require('express');
let app = express();
let db = require('../db/db');

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
    let requestData = req.query.data;
    let msgId = req.query.msgId;
    let userId = requestData.userId;
    db.createAccount(userId, (data) => {
        // if (data === null) {
        //     let ret = {
        //         msgId: 1001,
        //         errcode: 0,
        //         data: data
        //     };
        //     send(res, ret);
        // }
        let ret = {
            msgId: 1001,
            errcode: 0,
            data: data
        };
        send(res, ret);
    });
})

module.exports = {
    start(config) { //config对应account的配置
        app.listen(config.port);
        console.log('>>>>>account server is listening on <<<<<<', config.host + ':' + config.port);
    }
}