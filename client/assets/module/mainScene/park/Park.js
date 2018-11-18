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
        spDotLine: {
            displayName: 'spDotLine',
            default: null,
            type: cc.Sprite
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.ParkShowBoatShadow,
            GameLocalMsg.Msg.ParkHideBoatShadow,
            GameLocalMsg.Msg.PushBoatInWay,
            GameLocalMsg.Msg.MergeBoat
        ];
    },

    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.ParkShowBoatShadow) {
            if (this._data.index === data.index) {
                this._showShadow(data.level);
            }
            if (this._data.level === data.level && this._data.index !== data.index) {
                this._showDotLine();
            }
        } else if (msg === GameLocalMsg.Msg.ParkHideBoatShadow) {
            if (this._data._index === data.index) {
                this._hideShadow();
            }
            this._hideDotLine();
        } else if (msg === GameLocalMsg.Msg.PushBoatInWay) {
            this._hideDotLine();
        } else if (msg === GameLocalMsg.Msg.MergeBoat) {
            this._hideDotLine();
            if (this._data.index === data.index1 || this._data.index === data.index2) {
                this.initView(data.parkArr[this._data.index]);
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
        this._hideDotLine(); //隐藏虚线
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
        if (this.spBoatShadow.node.active === false) return;
        let sendData = {
            userId: GameData.playerInfo.userId,
            index: this._data.index
        };
        NetHttpMgr.quest(GameMsgHttp.Msg.PullBoatBackPark, sendData);
    },

    _hideDotLine() { //隐藏虚线
        this.spDotLine.node.stopAllActions();
        this.spDotLine.node.active = false;
    },

    _showDotLine() { //显示虚线
        this.spDotLine.node.active = true;
        this.spDotLine.node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.2, 1), cc.scaleTo(0.3, 0.6))));
    }
});