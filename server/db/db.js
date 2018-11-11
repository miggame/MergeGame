//标准配置
const mongoose = require('mongoose');

//工具类引用
// const util = require('../utils/util');
// const dayjs = require('../node_modules/dayjs');
const moment = require('../node_modules/moment');
const gameData = require('../gameData/gameData');
const _ = require('../node_modules/lodash');


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
    // normalDrop: Number,
    // rewardDrop: Number
    dropCache: Array //dropCache=[1,2] 1代表常规 2代表奖励
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

//根据下落数量更新空闲船位数组
function getRandIndexArr(count, parkArr) { //count:为长度
    //获取空闲船位索引数组
    let emptyParkIndexArr = getEmptyParkIndexArr(parkArr);
    let randIndexArr = _.sampleSize(emptyParkIndexArr, count);
    return randIndexArr;
}

//获取更新停船位的数据
function getUpdatedParkArrData(count, dropBoatLevel, parkArr) {
    let data = [];
    let randIndexArr = getRandIndexArr(count, parkArr);
    for (const iter of randIndexArr) {
        let dataItem = {
            status: 1,
            level: dropBoatLevel,
            index: iter
        };
        data.push(dataItem);
    }
    return data;
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

//获取rewardDrop剩余数量
function getRewardDropNum(docs) {
    return docs.rewardDrop;
}
//获取normalDrop剩余数量
function getNormalDropNum(docs) {
    return docs.normalDrop;
}

//放进dropCache
function pushDropCache(docs, type) {
    let dropCache = docs.dropCache;
    if (dropCache.length === 0) {
        dropCache.push(type);
    }
    return dropCache;
}
//更新数据库中dropCache
function updateUserDropCache(condition, docs, type, num) {
    let dropCache = docs.dropCache;
    let addArr = _.fill(Array(num), type); //被添加的数组

    if (type === 2 || (type === 1 && _.last(dropCache) === undefined)) {
        let tempDropCache = _.concat(dropCache, addArr);
        User.findOneAndUpdate(condition, {
            dropCache: tempDropCache
        }, (err, docs) => {
            if (err) {
                console.error('err: ', err);
                return;
            }
            console.log('====update successful====');
        });
    }
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
                    // normalDrop: 0,
                    // rewardDrop: 0
                    dropCache: []
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

    dropBoat(userId, type, num, cb) { //请求掉落船只
        let condition = {
            userId: userId
        };
        User.findOne(condition, (err, docs) => {
            let parkArr = docs.parkArr;
            if (isParkFull(parkArr)) { //没有空闲位
                if (cb) {
                    cb(null);
                }
                updateUserDropCache(condition, docs, type, num);
                return;
            }

            //有空闲位置时
            let dropCache = docs.dropCache;
            let count = 0; //下落船只数量
            if (dropCache.length === 0) { //下落缓存中无数据时
                count = 1;
            } else { //下落缓存中有数据时
                let emptyParkArr = getEmptyParkArr(parkArr);
                count = Math.min(emptyParkArr.length, dropCache.length);
            }
            let dropBoatLevel = getDropBoatLevel(docs.maxOwnedBoatLevel); //下落船只等级
            let parkArrData = getUpdatedParkArrData(count, dropBoatLevel, parkArr); //所更新的停船位的数组数据
            for (const iter of parkArrData) {
                let index = iter.index;
                parkArr[index] = iter;
            }
            User.updateOne(condition, {
                parkArr: parkArr
            }, (err, raw) => {
                let data = parkArrData;
                if (err) {
                    console.error('err: ', err);
                    return;
                }
                if (cb) {
                    cb(data);
                    return;
                }
            });
        });
    },

    pushBoatInWay(userId, index, cb) { //推送船只到航道上
        let condition = {
            userId: userId
        };
        User.findOne(condition, (err, docs) => {
            if (err) {
                console.error('err: ', err);
                return;
            }
            let parkArr = docs.parkArr;
            parkArr[index].status = 2;
            User.updateOne(condition, {
                parkArr: parkArr
            }, (err, raw) => {
                if (err) {
                    console.error('err: ', err);
                    return;
                }
                console.log('====push boat in way update successful====');
                if (cb) {
                    let sendData = {
                        index: index,
                        parkArr: parkArr
                    }
                    cb(sendData);
                }
            });
        });
    },

    pullBoatBackPark(userId, index, cb) {
        let condition = {
            userId: userId
        };
        User.findOne(condition, (err, docs) => {
            if (err) {
                console.error('err: ', err);
                return;
            }
            let parkArr = docs.parkArr;
            parkArr[index].status = 1;
            User.updateOne(condition, {
                parkArr: parkArr
            }, (err, raw) => {
                if (err) {
                    console.error('err: ', err);
                    return;
                }
                console.log('====pull boat back park update successful====');
                if (cb) {
                    let sendData = {
                        index: index,
                        parkArr: parkArr
                    }
                    cb(sendData);
                }
            });
        });
    }
}