let Util = require('Util');

module.exports = {
    playerInfo: {
        userId: '',
        name: '',
        diamond: 0,
        medal: 0,
        gold: 0,
        historyGold: 0,
        level: 0
    },

    initPlayerInfo(data) {
        if (data === undefined) {
            this.resetPlayerInfo();
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
    }
};