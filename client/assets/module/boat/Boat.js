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
        _level: null,
        _status: null,
        _index: null,
        _basePos: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [];
    },
    _onMsg(msg, data) {

    },
    onLoad() {
        this._initMsg();
        //开启船的操作监听
        this._initBoatListener();
    },

    start() {

    },

    // update (dt) {},
    initView(level, status, index, flag = true) {
        this._status = status;
        this._level = level;
        this._index = index;

        flag === true ? this._showBox() : this._showBoat();
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
        //TODO 根据status判断船是运动还是静止 

    },
    _showLevel() {
        this.lblBoatLevel.node.active = this.spBoat.node.active;
        this.lblBoatLevel.string = this._level;
    },

    _openBox() {
        if (this.spBoat.node.active) return;
        this._showBoat();
    },

    //开启船的操作监听
    _initBoatListener() {
        this.node.on('touchstart', (event) => {
            console.log('====event====: ', event);
            this._basePos = this.node.position;
        });

        this.node.on('touchmove', (event) => {
            this.node.x += event.getDelta().x;
            this.node.y += event.getDelta().y;
        });

        this.node.on('touchend', () => {

        });

        this.node.on('touchcancel', () => {

        });
    }
});