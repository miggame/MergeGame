let Observer = require('Observer');
let Util = require('Util');
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
        return [];
    },

    _onMsg(msg, data) {

    },
    onLoad() {
        this._initMsg();
    },

    start() {

    },

    // update (dt) {},
    initView(data) {
        this._data = data;
        this.node.setLocalZOrder(data.index);
        this.btnParkPlus.node.active = data.status === -1;
        this.spBoatShadow.node.active = data.status === 2;
        if (this.spBoatShadow.node.active) {
            let level = data.level;
            let path = 'boat/boat_' + level;
            Util.setSpriteFrame(path, this.spBoatShadow);
        }
    },

    onBtnClickToPlusPark() {

    }
});