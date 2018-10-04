let Observer = require('Observer');
let NetMaskModule = require('NetMaskModule');
let NetHttpMgr = require('NetHttpMgr');

cc.Class({
    extends: Observer,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [];
    },
    _onMsg(msg, data) {

    },
    onLoad() {
        this._initMsg();
        // NetMaskModule.preload();
        NetMaskModule.initEvent();
        let sendData = {
            userId: _.uniqueId('account')
        };
        NetHttpMgr.quest(GameMsgHttp.Msg.Register, sendData);
    },

    start() {

    },

    // update (dt) {},
});