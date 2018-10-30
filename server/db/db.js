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
    maxOwnedBoatLevel: Number,
    maxBuyBoatLevel: Number,
    lastLoginTime: Date,
    curLoginTime: Date,
    loginTimes: Number,
    sevenDay: Array,
    sumDay: Number,
    gameData: Map,
    parkArr: Array,
    way: Number,
    normalDrop: Number,
    rewardDrop: Number
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

//获取空闲船位数组
function getEmptyParkArr(parkArr) {
    let emptyParkArr = [];

    let len = parkArr.length;
    for (let i = 0; i < len; ++i) {
        if (parkArr[i].status === 0) emptyParkArr.push(parkArr[i]);
    }
    return emptyParkArr;
}

//获取空闲船位索引数组
function getEmptyParkIndexArr(parkArr) {
    let emptyParkIndexArr = [];

    let len = parkArr.length;
    for (let i = 0; i < len; ++i) {
        if (parkArr[i].status === 0) emptyParkIndexArr.push(parkArr[i].index);
    }
    return emptyParkIndexArr;
}

//判定是否有空船位
function isParkFull(parkArr) {
    return getEmptyParkArr(parkArr).length === 0 ? true : false;
}

//获取掉落船只的级别
function getDropBoatLevel(maxOwnedBoatLevel) {
    let dropBoatLevel = 0;
    if (maxOwnedBoatLevel === 0) {
        dropBoatLevel = 1;
        return dropBoatLevel;
    }
    let boatData = gameData.data.boatShop;
    let giftBoat1 = boatData[maxOwnedBoatLevel].giftBoat1;
    let giftBoat2 = boatData[maxOwnedBoatLevel].giftBoat2;
    let chance1 = boatData[maxOwnedBoatLevel].chance1;
    // let chance2 = boatData[maxOwnedBoatLevel].chance2;
    dropBoatLevel = Math.floor(cc.random0To1() * 100) < chance1 ? giftBoat1 : giftBoat2;
    return dropBoatLevel;
}

//普通掉落记数
function recordNormalDrop(condition, docs) {
    let normalDrop = docs.normalDrop;
    normalDrop++;
    console.log('====normalDrop====: ', normalDrop);
    User.findOneAndUpdate(condition, {
        normalDrop: normalDrop
    });
}
//奖励掉落记数
function recordRewardDrop() {

}
//根据conditoin获取用户基础信息
function findUserInfo(condition, cb) {
    User.findOne(condition, (err, docs) => {
        if (err) {
            console.error('err: ', err);
            return;
        }
        if (cb) {
            cb(docs);
        }
    });
}

function dropBoatArrInRecord(condition, count, docs, cb) {
    let parkArr = docs.parkArr;
    let data = [];
    for (let i = 0; i < count; ++i) {
        let dropBoatLevel = getDropBoatLevel(docs.maxOwnedBoatLevel);
        //获取空闲船位索引数组
        let emptyParkIndexArr = getEmptyParkIndexArr(parkArr);
        let len = emptyParkIndexArr.length;
        let randIndex = emptyParkIndexArr[(Math.floor(Math.random() * len))];
        let status = 1;
        parkArr[randIndex].status = parseInt(status);
        parkArr[randIndex].level = dropBoatLevel;
        let dataItem = {
            index: randIndex,
            level: dropBoatLevel,
            status: status
        };
        data.push(dataItem);
    }
    console.log('====data====: ', data);
    User.updateOne(condition, {
        parkArr: parkArr
    }, (err, raw) => {
        if (err) {
            console.error('err: ', err);
            //TODO 
            return;
        }
        if (cb) {
            cb(data);
            return;
        }
    });
}

//获取rewardDrop剩余数量
function getRewardDropNum(docs) {
    return docs.rewardDrop;
}
//获取normalDrop剩余数量
function getNormalDropNum(docs) {
    return docs.normalDrop;
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
                    maxOwnedBoatLevel: 0,
                    maxBuyBoatLevel: 0,
                    lastLoginTime: moment().toDate(),
                    curLoginTime: moment().toDate(),
                    loginTimes: 1,
                    sevenDay: [1, 0, 0, 0, 0, 0, 0],
                    sumDay: 1,
                    gameData: gameData.data,
                    parkArr: getPark(1),
                    way: getWay(1),
                    normalDrop: 0,
                    rewardDrop: 0
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
    },

    updateParkStatus(userId, index, status, level, cb) { //更新船位状态
        let condition = {
            userId: userId
        };

        User.findOne(condition, (err, docs) => {
            if (err) {
                console.error('err: ', err);
                if (cb) {
                    cb(null)
                };
                return;
            }
            let parkArr = docs.parkArr;
            parkArr[index].status = parseInt(status);
            parkArr[index].level = parseInt(level);
            User.updateOne(condition, {
                parkArr: parkArr
            }, (err, raw) => {
                if (err) {
                    console.error('err: ', err);
                    if (cb) cb(null);
                    return;
                }
                if (cb) {
                    cb(parkArr);
                }
            });
        });
    },

    dropBoat(userId, cb) { //请求掉落船只
        let condition = {
            userId: userId
        };
        User.findOne(condition, (err, docs) => {
            let parkArr = docs.parkArr;
            if (isParkFull(parkArr)) {
                if (cb) {
                    cb(null);
                }
                recordNormalDrop(condition, docs); //普通掉落记数+1
                return;
            }
            //获取掉落等级
            let dropBoatLevel = getDropBoatLevel(docs.maxOwnedBoatLevel);
            //获取空闲船位索引数组
            let emptyParkIndexArr = getEmptyParkIndexArr(parkArr);
            let len = emptyParkIndexArr.length;
            let randIndex = emptyParkIndexArr[(Math.floor(Math.random() * len))];
            let status = 1;
            parkArr[randIndex].status = parseInt(status);
            parkArr[randIndex].level = dropBoatLevel;

            User.updateOne(condition, {
                parkArr: parkArr
            }, (err, raw) => {
                let data = {
                    index: randIndex,
                    level: dropBoatLevel,
                    status: status
                };
                if (err) {
                    console.error('err: ', err);
                    //TODO 
                    return;
                }
                if (cb) {
                    cb(data);
                    return;
                }
            });
        });
    },
    //调落记录中的箱子
    dropBoatInRecord(userId, cb) {
        let condition = {
            userId: userId
        };
        findUserInfo(condition, (docs) => {
            let parkArr = docs.parkArr;
            if (isParkFull(parkArr)) {
                if (cb) {
                    cb(null);
                }
                return;
            }
            let rewardDropNum = getRewardDropNum(docs);
            let normalDropNum = getNormalDropNum(docs);
            let emptyParkArr = getEmptyParkArr(parkArr);
            let emptyParkLen = emptyParkArr.length;
            if (rewardDropNum > 0) {
                let len = 0;
                let diff = rewardDropNum - emptyParkLen;
                len = diff >= 0 ? emptyParkLen : rewardDropNum;
                dropBoatArrInRecord(condition, len, docs, cb);
            }
        });
    }
}