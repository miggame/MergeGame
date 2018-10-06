let Observer = require('Observer');
let NetHttpMgr = require('NetHttpMgr');
let GameData = require('GameData');
let Util = require('Util');

cc.Class({
    extends: Observer,

    properties: {
        spReward0: {
            displayName: 'spReward0',
            default: null,
            type: cc.Sprite
        },
        spReward1: {
            displayName: 'spReward1',
            default: null,
            type: cc.Sprite
        },
        lblReward0: {
            displayName: 'lblReward0',
            default: null,
            type: cc.Label
        },
        lblReward1: {
            displayName: 'lblReward1',
            default: null,
            type: cc.Label
        },
        spShadow: {
            displayName: 'spShadow',
            default: null,
            type: cc.Sprite
        },
        spComplete: {
            displayName: 'spComplete',
            default: null,
            type: cc.Sprite
        },
        lblDay: {
            displayName: 'lblDay',
            default: null,
            type: cc.Label
        },
        btnBuy: {
            displayName: 'btnBuy',
            default: null,
            type: cc.Button
        },
        _data: null, //奖励数据,
        _status: null, //状态
        _index: null, //序列
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameMsgHttp.Msg.UpdateSevenDay.msg
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameMsgHttp.Msg.UpdateSevenDay.msg) {
            if (this._status !== data[this._index]) {
                this._status = data[this._index];
                this._refresh(this._status);
            }
        }
    },
    onLoad() {
        this._initMsg();
    },

    start() {

    },

    // update (dt) {},
    initView(data, status, index) { //index从1开始,status:0未解锁，1已解锁，2已领取
        this._data = data;
        this._status = status;
        this._index = index;
        this.lblDay.string = 'DAY' + data.day;
        this.spReward0.node.active = data.goldReward > 0;
        this.spReward1.node.active = data.diamondReward > 0;
        this.lblReward0.string = Util.numberFormat(data.goldReward);
        this.lblReward1.string = Util.numberFormat(data.diamondReward);
        this._refresh(status);

    },

    _refresh(status) {
        this.btnBuy.interactable = status === 1;
        this.spShadow.node.active = status !== 1;
        this.spComplete.node.active = status === 2;
    },

    onBtnClickToReceive() {
        let sendData = {
            userId: GameData.playerInfo.userId,
            index: this._index
        }
        NetHttpMgr.quest(GameMsgHttp.Msg.UpdateSevenDay, sendData);
    }
});