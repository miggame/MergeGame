//标准配置
const mongoose = require('mongoose');

//工具类引用
// const util = require('../utils/util');
// const dayjs = require('../node_modules/dayjs');
const moment = require('../node_modules/moment');
const gameData = require('../gameData/gameData');


let Schema = mongoose.Schema;

let userSchema = new Schema({
    userId: String,
    gold: Number,
    diamond: Number,
    medal: Number,
    historyGold: Number,
    level: Number,
    lastLoginTime: Date,
    curLoginTime: Date,
    loginTimes: Number,
    sevenDay: Array,
    sumDay: Number,
    gameData: Map,
    parkArr: Array,
    way: Number
});

// let sevenDaySchema = new Schema({
//     userId: String,
//     sevenDay: Array,
//     sumDay: Number,
//     lastLoginTime: Date
// });

let User = mongoose.model('User', userSchema);
// let SevenDay = mongoose.model('SevenDay', sevenDaySchema);

//通用方法
function resetSevenDay(userId) {
    let sevenDay = [1, 0, 0, 0, 0, 0, 0];
    let sumDay = 1;
    let lastLoginTime = new Date();
    let data = {
        userId: userId,
        sevenDay: sevenDay,
        sumDay: sumDay,
        lastLoginTime: lastLoginTime
    };
    return data;
}

function isSameDay(day1, day2) {
    let isSameDay = day1.isSame(day2, 'day');
    return isSameDay;
}

function diffDay(day1, day2) {
    return day1.diff(day2, 'day');
}

function getPark(index) {
    let parkArr = [];

    let len = gameData.data.level[index].parking;
    for (let i = 0; i < len; ++i) {
        let data = {
            index: i,
            status: 0,
            level: 0
        };
        parkArr.push(data);
    }
    let parkPlusData = {
        index: len,
        status: -1,
        level: 0
    };
    parkArr.push(parkPlusData);
    return parkArr;
}

function getWay(index) {
    let way = gameData.data.level[index].way;
    return way;
}

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

    isAccountExist(userId, cb) { //判断账号是否已存在
        let condition = {
            userId: userId
        };
        User.find(condition, (err, docs) => {
            let flag = null;
            if (err) {
                console.error('err: ', err);
                return;
            }
            if (docs.length === 0) {
                flag = false;
            } else if (docs.length === 1) {
                flag = true;
            } else if (docs.length > 1) {
                flag = null;
            }
            if (cb) {
                cb(flag);
            }
        });
    },

    createAccount(userId, cb) { //创建账号
        this.isAccountExist(userId, (flag) => {
            if (flag === null) {
                console.log('====同时存在多个账号====');
                if (cb) {
                    cb(null);
                }
                return;
            }
            if (flag === true) {
                User.find({
                    userId: userId
                }, (err, docs) => {
                    if (err) {
                        console.error('err: ', err);
                        return;
                    }
                    let day1 = moment(docs[0].curLoginTime);
                    let day2 = moment(docs[0].lastLoginTime);
                    docs[0].curLoginTime = moment().toDate(); //更新当前时间

                    let diff = diffDay(day1, day2);
                    if (diff === 0) {
                        docs[0].loginTimes++;
                    } else if (diff === 1) {
                        docs[0].loginTimes = 1;
                        docs[0].sumDay++;
                        if (docs[0].sumDay > 7) {
                            docs[0].sumDay = 1;
                        }
                    } else if (diff > 1) {
                        docs[0].loginTimes = 1;
                        docs[0].sumDay = 1;
                    }

                    if (cb) {
                        cb(docs[0]);
                    }
                    docs[0].lastLoginTime = moment().toDate(); //更新上次登录时间
                    User.updateOne({
                        userId: userId
                    }, docs[0], (err, raw) => {
                        if (err) {
                            console.error('err: ', err);
                            return;
                        }
                        console.log('====raw====: ', raw);
                    });
                });
            } else {
                //创建账号
                let data = {
                    userId: userId,
                    gold: 2000,
                    historyGold: 2000,
                    medal: 0,
                    diamond: 0,
                    level: 0,
                    lastLoginTime: moment().toDate(),
                    curLoginTime: moment().toDate(),
                    loginTimes: 1,
                    sevenDay: [1, 0, 0, 0, 0, 0, 0],
                    sumDay: 1,
                    gameData: gameData.data,
                    parkArr: getPark(1),
                    way: getWay(1)
                };
                console.log('====data====: ', data);
                User.create(data, (err, docs) => {
                    if (err) {
                        console.error('err: ', err);
                        return;
                    }
                    if (cb) {
                        cb(docs);
                    }
                });
            }
        });
    },

    updateSevenDay(userId, index, cb) {
        let condition = {
            userId: userId
        };
        User.findOne(condition, (err, docs) => {
            if (err) {
                console.error('err: ', err);
                return;
            }
            if (docs === null) {
                console.log('传参数有误');
                if (cb) {
                    cb(null);
                    return;
                }
            }

            docs.sevenDay[index] = 2;
            let indexOfGameDataSevenDay = parseInt(index) + 1;

            let sevenDayOfGameData = docs.gameData.get('sevenDay');
            if (sevenDayOfGameData[indexOfGameDataSevenDay].goldReward !== 0) {
                docs.gold += sevenDayOfGameData[indexOfGameDataSevenDay].goldReward;
            }
            if (sevenDayOfGameData[indexOfGameDataSevenDay].diamondReward !== 0) {
                docs.diamond += sevenDayOfGameData[indexOfGameDataSevenDay].diamondReward;
            }

            let updateData = {
                sevenDay: docs.sevenDay,
                gold: docs.gold,
                diamond: docs.diamond
            }

            User.updateOne(condition, updateData, (err, raw) => {
                if (err) {
                    console.error('err: ', err);
                    return;
                }
                if (cb) {
                    cb(updateData);
                }
            });
        });
    },

    exchangeMedal(userId, gold, medal, cb) {
        let condition = {
            userId: userId
        };
        User.findOne(condition, (err, docs) => {
            if (err) {
                console.error('err: ', err);
                if (cb) {
                    cb(null);
                }
                return;
            }
            console.log('====docs.gold====: ', typeof docs.gold);
            console.log('====gold====: ', typeof gold);
            docs.gold += gold;
            docs.medal += medal;
            User.updateOne(condition, docs, (err, raw) => {
                if (err) {
                    console.error('err: ', err);
                    if (cb) {
                        cb(null);
                    }
                    return;
                }
                if (cb) {
                    cb(docs);
                }
            });
        });
    }
}