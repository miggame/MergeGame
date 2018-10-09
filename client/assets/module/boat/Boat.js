let Observer = require('Observer');
cc.Class({
    extends: cc.Component,

    properties: {
        _animState: null,
        spBoat: {
            displayName: 'spBoat',
            default: null,
            type: cc.Sprite
        },
        boxNode: {
            displayName: 'boxNode',
            default: null,
            type: cc.Node
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
        this._showBox();
    },

    start() {

    },

    // update (dt) {},

    _showBox() {
        this.boxNode.active = true;
        this.spBoat.node.active = !this.boxNode.active;
    },
    _showBoat() {
        this.boxNode.active = false;
        this.spBoat.node.active = !this.boxNode.active;
    },

    openBox() {
        if (this.spBoat.node.active) return;
        this._showBoat();
    }
});