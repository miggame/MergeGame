let Observer = require('Observer');

cc.Class({
    extends: Observer,

    properties: {
        spBlankWay: {
            displayName: 'spBlankWay',
            default: null,
            type: cc.Sprite
        },
        spWay: {
            displayName: 'spWay',
            default: null,
            type: cc.Sprite
        },
        _index: null
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
    initView(index, numInWay) {
        // this.spWay.node.active = flag;
        // this.spBlankWay.node.active = !this.spWay.node.active;
        this._index = index;
        this.spWay.node.active = index <= numInWay;
        this.spWay.node.scaleX = parseInt(index) % 2 === 0 ? 1 : -1;
        this.spBlankWay.node.active = !this.spWay.node.active;
        this.spBlankWay.node.scaleX = -this.spWay.node.scaleX;
    }
});