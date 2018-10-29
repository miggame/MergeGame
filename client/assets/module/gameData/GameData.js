let Util = require('Util');
let ObserverMgr = require('ObserverMgr');
module.exports = {
    parkColMax: 3,
    playerInfo: {
        userId: '',
        name: '',
        diamond: 0,
        medal: 0,
        gold: 0,
        historyGold: 0,
        level: 0,
        maxOwnedBoatLevel: 0,
        maxBuyBoatLevel: 0,
        loginTimes: 1,
        sevenDay: [1, 0, 0, 0, 0, 0, 0],
        sumDay: 1,
        gameData: null,
        parkArr: [],
        way: 0,
        normalDrop: 0,
        rewardDrop: 0
    },

    initPlayerInfo(data) {
        if (data === undefined) {
            this.resetPlayerInfo();
            this.resetGameData();
            let userId = Util.getStorage('UserId');
            if (userId === null || userId === undefined) {
                userId = dayjs().unix();
                Util.setStorage('UserId', userId);
            }
            this.playerInfo.userId = userId;
        } else {
            this.playerInfo.userId = data.userId;
            this.playerInfo.gold = data.gold;
            this.playerInfo.name = data.name;
            this.playerInfo.medal = data.medal;
            this.playerInfo.diamond = data.diamond;
            this.playerInfo.historyGold = data.historyGold;
            this.playerInfo.level = data.level;
            this.playerInfo.maxOwnedBoatLevel = data.maxOwnedBoatLevel;
            this.playerInfo.maxBuyBoatLevel = data.maxBuyBoatLevel;
            this.playerInfo.loginTimes = data.loginTimes;
            this.playerInfo.sevenDay = data.sevenDay;
            this.playerInfo.sumDay = data.sumDay;
            this.playerInfo.gameData = data.gameData;
            this.playerInfo.parkArr = data.parkArr;
            this.playerInfo.way = data.way;
            this.playerInfo.normalDrop = data.normalDrop;
            this.playerInfo.rewardDrop = data.rewardDrop;
        }
    },

    resetPlayerInfo() {
        this.playerInfo.userId = '';
        this.playerInfo.name = '';
        this.playerInfo.gold = 0;
        this.playerInfo.diamond = 0;
        this.playerInfo.historyGold = 0;
        this.playerInfo.medal = 0;
        this.playerInfo.level = 0;
        this.playerInfo.loginTimes = 1;
        this.playerInfo.sevenDay = [1, 0, 0, 0, 0, 0, 0];
        this.playerInfo.gameData = null;
        this.playerInfo.parkArr = [];
        this.playerInfo.way = 0;
        this.playerInfo.normalDrop = 0;
        this.playerInfo.rewardDrop = 0;
    },

    resetGameData() {
        this.gameData = null;
    },

    initGameDataEvent() {
        ObserverMgr.removeEventListenerWithObject(this);
        //监听勋章兑换
        ObserverMgr.addEventListener(GameMsgHttp.Msg.ExchangeMedal.msg, (msg, data) => {
            if (data !== null) {
                this.playerInfo.gold = data.gold;
                this.playerInfo.medal = data.medal;
                ObserverMgr.dispatchMsg(GameLocalMsg.Msg.UpdateUserinfo, this.playerInfo);
            }
        }, this);

        //领取七日登陆奖励
        ObserverMgr.addEventListener(GameMsgHttp.Msg.UpdateSevenDay.msg, (msg, data) => {
            if (data !== null) {
                this.playerInfo.gold = data.gold;
                this.playerInfo.diamond = data.diamond;
                ObserverMgr.dispatchMsg(GameLocalMsg.Msg.UpdateUserinfo, this.playerInfo);
            }
        }, this)
    }
};