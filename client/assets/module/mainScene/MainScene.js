let Observer = require('Observer');
let UIMgr = require('UIMgr');
let NetHttpMgr = require('NetHttpMgr');
let GameData = require('GameData');

cc.Class({
    extends: Observer,

    properties: {
        topBarPre: {
            displayName: 'topBarPre',
            default: null,
            type: cc.Prefab
        },
        uiNode: {
            displayName: 'uiNode',
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameMsgHttp.Msg.SevenDay.msg
        ];
    },
    _onMsg(msg, data) {

    },
    onLoad() {
        this._initMsg();

        //七日登陆
        let sendData = {
            userId: GameData.playerInfo.userId
        };
        NetHttpMgr.quest(GameMsgHttp.Msg.SevenDay, sendData);
    },

    start() {

    },

    // update (dt) {},
});