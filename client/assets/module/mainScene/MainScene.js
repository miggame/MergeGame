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
        basePark: {
            displayName: 'basePark',
            default: null,
            type: cc.Node
        },
        _parkWidth: null,
        _parkHeight: null
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
        //初始化停船位
        this._parkWidth = this.basePark.width * 1.4;
        this._parkHeight = this.basePark.height * 1.4;
        this.basePark.active = false;
        this.parkLayer.removeAllChildren();
        this._initPark(GameData.playerInfo.parkArr);

        //七日登录展示
        if (GameData.playerInfo.loginTimes === 1) {
            //七日登陆
            UIMgr.createPrefab(this.sevenDayPre, (root, ui) => {
                this.uiNode.addChild(root);
            });
            return;
        }

    },

    start() {

    },

    // update (dt) {},
    //显示七日登录
    onBtnClickToSevenDay() {
        //七日登陆
        UIMgr.createPrefab(this.sevenDayPre, (root, ui) => {
            this.uiNode.addChild(root);
        });
    },
    //初始化停船位
    _initPark(data) {
        console.log('====data====: ', data);
        let parkPosArr = this._getParkPosArr(data);
        let len = data.length;
        for (let i = 0; i < len; ++i) {
            let parkPreNode = cc.instantiate(this.parkPre);
            this.parkLayer.addChild(parkPreNode);
            parkPreNode.position = parkPosArr[i];
            parkPreNode.getComponent('Park').initView(data[i]);
        }
    },
    //获取停船位坐标
    _getParkPosArr(data) {
        let len = data.length;
        let colMax = GameData.parkColMax;
        let rowMax = Math.ceil(len / colMax);
        let index = 0;
        let midCol = Math.floor(colMax / 2);
        let midRow = Math.floor(rowMax / 2);
        let posArr = [];
        for (let i = 0; i < rowMax; ++i) {
            for (let j = 0; j < colMax; ++j) {
                index++;
                if (index <= len) {
                    let x = (j - midCol) * this._parkWidth;
                    let y = (midRow - i) * this._parkHeight;
                    posArr.push(cc.v2(x, y));
                }
            }
        }
        return posArr;
    },
    //自动降落船只
    _autoCreateBoat() {
        this.schedule(this._createBoat, 5);
    },
    //获取空闲船位数组
    _getEmptyParkArr() {
        let emptyParkArr = [];
        let parkArr = GameData.playerInfo.parkArr;
        let len = parkArr.length;
        for (let i = 0; i < len; ++i) {
            if (parkArr[i].status === 0) emptyParkArr.push(parkArr[i]);
        }
        return emptyParkArr;
    },
    //判定是否有空船位
    _isParkFull() {
        return this._getEmptyParkArr().length === 0 ? true : false;
    },
    //创建船只
    _createBoat() {
        let parkArr = GameData.playerInfo.parkArr;
        let len = parkArr.length;
        for (let i = 0; i < len; ++i) {
            if (parkArr[i].status === 0) {
                break;
            }
        }
    }
});