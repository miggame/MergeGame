let Observer = require('Observer');
let GameData = require('GameData');
let Util = require('Util');

cc.Class({
    extends: Observer,

    properties: {
        lblUserGold: {
            displayName: 'lblUserGold',
            default: null,
            type: cc.Label
        },
        lblSecGold: {
            displayName: 'lblSecGold',
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.UpdateUserinfo
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.UpdateUserinfo) {
            this._refreshUserGold();
        }
    },
    onLoad() {
        this._initMsg();
        this._refreshUserGold();
    },

    start() {

    },

    // update (dt) {},
    _refreshUserGold() {
        this.lblUserGold.string = Util.numberFormat(GameData.playerInfo.gold);
    }
});