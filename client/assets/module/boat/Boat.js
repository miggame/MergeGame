let Observer = require('Observer');
cc.Class({
    extends: Observer,

    properties: {
        _animState: null,
        spBoat: {
            displayName: 'spBoat',
            default: null,
            type: cc.Sprite
        },
        lblBoatLevel: {
            displayName: 'lblBoatLevel',
            default: null,
            type: cc.Label
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
    },

    start() {

    },

    // update (dt) {},
    initView(level) {
        this._level = level;
        this._showBox();
    },

    _showBox() {
        this.boxNode.active = true;
        this.spBoat.node.active = !this.boxNode.active;
        this.scheduleOnce(this._openBox, 3);
    },
    _showBoat() {
        this.boxNode.active = false;
        this.spBoat.node.active = !this.boxNode.active;
        this._showLevel();
    },
    _showLevel() {
        this.lblBoatLevel.node.active = this.spBoat.node.active;
        this.lblBoatLevel.string = this._level;
    },

    _openBox() {
        if (this.spBoat.node.active) return;
        this._showBoat();
    }
});