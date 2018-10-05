let Observer = require('Observer');
let NetMaskModule = require('NetMaskModule');
let NetHttpMgr = require('NetHttpMgr');
let Util = require('Util');
let GameData = require('GameData');

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
        return [
            GameMsgHttp.Msg.Register.msg
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameMsgHttp.Msg.Register.msg) {
            console.log('data: ', data);
            cc.director.loadScene('MainScene');
        }
    },
    onLoad() {
        this._initMsg();
        // NetMaskModule.preload();
        NetMaskModule.initEvent(); //初始化http请求遮罩
        GameData.initPlayerInfo(); //初始化玩家数据
        let sendData = {
            userId: GameData.playerInfo.userId
        };
        NetHttpMgr.quest(GameMsgHttp.Msg.Register, sendData);
    },

    start() {

    },

    // update (dt) {},
});