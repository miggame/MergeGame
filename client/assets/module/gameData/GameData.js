let Util = require('Util');

module.exports = {
    playerInfo: {
        userId: '',
        name: '',
        diamond: 0,
        medal: 0,
        gold: 0,
        historyGold: 0
    },

    initPlayerInfo() {
        let userId = Util.getStorage('UserId');
        if (userId === null || userId === undefined) {
            userId = dayjs().unix();
        }
        this.playerInfo.userId = userId;
        this.playerInfo.name = '';
        this.playerInfo.diamond = 0;
        this.playerInfo.medal = 0;
        this.playerInfo.gold = 0;
        this.playerInfo.historyGold = 0;
    }
};