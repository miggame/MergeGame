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
        sevenDayPre: {
            displayName: 'sevenDayPre',
            default: null,
            type: cc.Prefab
        },
        parkPre: {
            displayName: 'parkPre',
            default: null,
            type: cc.Prefab
        },
        parkLayer: {
            displayName: 'parkLayer',
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
        if (GameData.playerInfo.loginTimes === 1) {
            //七日登陆
            UIMgr.createPrefab(this.sevenDayPre, (root, ui) => {
                this.uiNode.addChild(root);
            });
            return;
        }
        let parkArr = [{
                index: 0,
                status: 0,
                level: 0
            },
            {
                index: 0,
                status: 0,
                level: 0
            },
            {
                index: 0,
                status: 0,
                level: 0
            },
        ];
        this._initPark(parkArr);
    },

    start() {

    },

    // update (dt) {},

    onBtnClickToSevenDay() {
        //七日登陆
        UIMgr.createPrefab(this.sevenDayPre, (root, ui) => {
            this.uiNode.addChild(root);
        });
    },
    //初始化停船位
    _initPark(data) {
        let spaceX = 200;
        let spaceY = 200;
        let len = data.length;

        let limit = 10;
        let colMax = len < limit ? 2 : 3;
        let rowMax = Math.ceil(len / colMax);
        if (len < limit) {
            for (let i = 0; i < len; ++i) {
                let parkPre = cc.instantiate(this.parkPre);
                this.parkLayer.addChild(parkPre);
                let midX = Math.floor(colMax / 2);
                let midY = Math.floor(rowMax / 2);
                parkPre.x = (i - midX) * spaceX;
                parkPre.y = (i - midY) * spaceY;
            }
        } else {

        }

    }
});