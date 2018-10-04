let Observer = require('Observer');
cc.Class({
    extends: Observer,

    properties: {
        hideNode: {
            displayName: 'hideNode',
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameMsgGlobal.Net.Send,
            GameMsgGlobal.Net.Recv
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameMsgGlobal.Net.Send) {

        } else if (msg === GameMsgGlobal.Net.Recv) {

        }
    },
    onLoad() {
        this._initMsg();
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        this.node.width = w;
        this.node.height = h;
        this.scheduleOnce(() => {
            this.hideNode.active = true;
        }, 0.3);
    },

    start() {

    },

    // update (dt) {},
});