let Observer = require('Observer');
let Util = require('Util');
let NetHttpMgr = require('NetHttpMgr');
let GameData = require('GameData');
cc.Class({
    extends: Observer,

    properties: {
        _data: null,
        btnParkPlus: {
            displayName: 'btnParkPlus',
            default: null,
            type: cc.Button
        },
        spBoatShadow: {
            displayName: 'spBoatShadow',
            default: null,
            type: cc.Sprite
        },

    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.ParkShowBoatShadow,
            GameLocalMsg.Msg.ParkHideBoatShadow
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.ParkShowBoatShadow) {
            if (this._data.index === data.index) {
                this._showShadow(data.level);
            }
        } else if (msg === GameLocalMsg.Msg.ParkHideBoatShadow) {
            if (this._data._index = data.index) {
                this._hideShadow();
            }
        }
    },
    onLoad() {
        this._initMsg();
    },

    start() {

    },

    // update (dt) {},
    initView(data) {
        this._data = data;
        this.node.setLocalZOrder(this._data.index);
        this.btnParkPlus.node.active = this._data.status === -1;
        data.status === 2 ? this._showShadow(this._data.level) : this._hideShadow();
    },

    onBtnClickToPlusPark() {

    },

    _showShadow(level) {
        this.spBoatShadow.node.active = true;
        let path = 'boat/boat_' + level;
        Util.setSpriteFrame(path, this.spBoatShadow);
    },

    _hideShadow() {
        this.spBoatShadow.node.active = false;
    },

    onBtnClickToPullBoatBackPark() {
        let sendData = {
            userId: GameData.playerInfo.userId,
            index: this._data.index
        };
        NetHttpMgr.quest(GameMsgHttp.Msg.PullBoatBackPark, sendData);
    }
});