let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
let Util = require('Util');
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
        boatShadow: {
            displayName: 'boatShadow',
            default: null,
            type: cc.Node
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
        return [
            GameLocalMsg.Msg.BoatGoBack,
            GameLocalMsg.Msg.PushBoatInWay,
            GameLocalMsg.Msg.PullBoatBackPark,
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.BoatGoBack) {
            // let index = data.index;
            if (this._index === data) {
                if (this.node.position === this._basePos) return;
                this.node.position = this._basePos;
                this.node.rotation = 0;
                ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ParkHideBoatShadow, {
                    index: this._index,
                });
            }
        } else if (msg === GameLocalMsg.Msg.PushBoatInWay) {
            // let index = data.index;
            if (this._index === data.index) {
                this._playBoatMove();
            }
        } else if (msg === GameLocalMsg.Msg.PullBoatBackPark) {
            // let index = data.index;
            if (this._index === data.index) {
                this._stopBoatMove();
                ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BoatGoBack, this._index);
            }
        }
    },
    onLoad() {
        this._initMsg();
        //开启船的操作监听
        this._initBoatListener();
    },

    start() {

    },

    // update (dt) {},
    initView(pos, level, status, index, flag = true) {
        this.node.position = pos;
        this._basePos = pos;
        this._status = status;
        this._level = level;
        this._index = index;
        flag === true ? this._showBox() : this._showBoat();

        if (this._status === 2) {
            this._playBoatMove();
        }
    },

    _showBox() {
        this.boxNode.active = true;
        this.spBoat.node.active = !this.boxNode.active;
        this.scheduleOnce(this._openBox, 3);
    },
    _showBoat() {
        this.boxNode.active = false;
        this.spBoat.node.active = !this.boxNode.active;
        // this.spBoat.node.y = this.spBoat.node.y + this.spBoat.node.height / 2;
        // Util.setSpriteFrame('boat/boat_' + this._level, this.spBoat);
        this.refreshBoatView();
        // this._showLevel();
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
            this._basePos = this.node.position;
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ParkShowBoatShadow, {
                index: this._index,
                level: this._level
            });
        });

        this.node.on('touchmove', (event) => {
            this.node.x += event.getDelta().x;
            this.node.y += event.getDelta().y;
        });

        this.node.on('touchend', () => {
            let boatBoundingBox = this.node.getBoundingBox();
            let sendData = {
                boatBoundingBox: boatBoundingBox,
                index: this._index,
                level: this._level
            }
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BoatIsInWay, sendData);
        });

        this.node.on('touchcancel', () => {

        });
    },

    _playBoatMove() {
        this.node.getComponent(cc.Animation).play('BoatMove');
    },

    _stopBoatMove() {
        this.node.getComponent(cc.Animation).stop('BoatMove');
    },

    //检测船只与船只是否有碰撞
    _checkBoatIntersect(boundingBox) {
        return boundingBox.contains(this.node.position);
    },

    //升级船只图片
    refreshBoatView() {
        Util.setSpriteFrame('boat/boat_' + this._level, this.spBoat);
        this.lblBoatLevel.node.active = this.spBoat.node.active;
        this.lblBoatLevel.string = this._level;
    }
});