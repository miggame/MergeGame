//标准配置
const config = require('../config');
const mongoose = require('mongoose');

//工具类引用
const util = require('../utils/util');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    userId: String,
    gold: Number,
    diamond: Number,
    medal: Number,
    historyGold: Number
});

let User = mongoose.model('User', userSchema);

module.exports = {
    init(config) { //初始化数据库
        let host = config.host;
        let port = config.port;
        let dbName = config.dbName;
        let uri = 'mongodb://' + host + ':' + port + '/' + dbName;
        mongoose.connect(uri, (err) => {
            if (err) {
                console.error('err: ', err);
                return;
            }
            console.log('connect database successful');
        });
    },

    isAccountExist(userId, cb) {
        User.find({
            userId: userId
        }, (err, res) => {
            if (err) {
                console.error('err: ', err);
                return;
            }
            if (cb) {
                res.length > 0 ? cb(true) : cb(false);
            }
        });
    },

    createAccount(userId) { //创建账号
        this.isAccountExist(userId, (bool) => {
            if (!bool) {
                console.log('====account has already existed====');
                return;
            }
            let data = {
                userId: userId,
                gold: 1000,
                diamond: 50,
                medal: 0,
                historyGold: 1000
            };
            User.create(data, (err, docs) => {
                if (err) {
                    console.error('err: ', err);
                    return;
                }
                console.log('====create account successful====');
            });
        })
    }
}