let Observer = require('Observer');
let GameData = require('GameData');
let Util = require('Util');
let UIMgr = require('UIMgr');
let ObserverMgr = require('ObserverMgr');
cc.Class({
    extends: Observer,

    properties: {
        userinfoBar: {
            displayName: 'userinfoBar',
            default: null,
            type: cc.Node
        },
        medalBar: {
            displayName: 'medalBar',
            default: null,
            type: cc.Node
        },
        diamondBar: {
            displayName: 'diamondBar',
            default: null,
            type: cc.Node
        },
        goldBar: {
            displayName: 'goldBar',
            default: null,
            type: cc.Node
        },
        lblUserGold: {
            displayName: 'lblUserGold',
            default: null,
            type: cc.Label
        },
        lblUserMedal: {
            displayName: 'lblUserMedal',
            default: null,
            type: cc.Label
        },
        lblUserDiamond: {
            displayName: 'lblUserDiamond',
            default: null,
            type: cc.Label
        },
        lblUserLevel: {
            displayName: 'lblUserLevel',
            default: null,
            type: cc.Label
        },
        medalPre: {
            displayName: 'medalPre',
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.ResetTopBar,
            GameLocalMsg.Msg.UpdateUserinfo
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.UpdateUserinfo) {
            this._refreshView();
        } else if (msg === GameLocalMsg.Msg.ResetTopBar) {
            this._resetBar(data);
        }
    },
    onLoad() {
        this._initMsg();
        this._resetBar(true);
        this._refreshView();
    },

    start() {

    },
    _resetBar(flag) { //flag为true时，goldbar隐藏，反之则相反
        this.goldBar.active = !flag;
        this.userinfoBar.active = !this.goldBar.active;
    },
    // update (dt) {},
    _refreshView() {
        this.lblUserMedal.string = Util.numberFormat(GameData.playerInfo.medal);
        this.lblUserDiamond.string = Util.numberFormat(GameData.playerInfo.diamond);
        this.lblUserLevel.string = Util.numberFormat(GameData.playerInfo.level);
        this.lblUserGold.string = Util.numberFormat(GameData.playerInfo.gold);
    },

    onBtnClickToMedal() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ResetTopBar, false);
        UIMgr.createPrefab(this.medalPre, (root, ui) => {
            this.node.parent.getChildByName('uiNode').addChild(root);
        });
        Util.reZOrderToTop(this.node);

    }
});