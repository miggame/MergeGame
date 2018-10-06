let Observer = require('Observer');
let UIMgr = require('UIMgr');

cc.Class({
    extends: Observer,

    properties: {
        _data: null,
        posArr: {
            displayName: 'posArr',
            default: [],
            type: [cc.Node]
        },
        sevenDayItemPre: {
            displayName: 'sevenDayItemPre',
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
    },

    start() {

    },

    // update (dt) {},
    initView(data) {
        this._data = data;
        let sevenDayReward = data.sevenDayReward;
        let sevenDay = data.sevenDay;
        for (const key in sevenDayReward) {
            if (sevenDayReward.hasOwnProperty(key)) {
                const element = sevenDayReward[key];
                let sevenDayItemPre = cc.instantiate(this.sevenDayItemPre);
                this.posArr[parseInt(key) - 1].addChild(sevenDayItemPre);
                sevenDayItemPre.getComponent('SevenDayItem').initView(element, sevenDay[parseInt(key) - 1], parseInt(key) - 1);
            }
        }
    },

    onBtnClickToClose() {
        UIMgr.destroyUI(this);
    }
});