let Observer = require('Observer');
let UIMgr = require('UIMgr');

cc.Class({
    extends: Observer,

    properties: {
        topBarPre: {
            displayName: 'topBarPre',
            default: null,
            type: cc.Prefab
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
        UIMgr.createPrefabToRunningScene(this.topBarPre, (uiNode) => {
            let script = uiNode.getComponent('TopBar');
            script.refreshView();
        })
    },

    start() {

    },

    // update (dt) {},
});