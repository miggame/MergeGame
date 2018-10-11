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
        //船位层
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
        _parkHeight: null,
        //船层
        boatLayer: {
            displayName: 'boatLayer',
            default: null,
            type: cc.Node
        },
        boatPre: {
            displayName: 'boatPre',
            default: null,
            type: cc.Prefab
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
        //初始化停船位
        this._parkWidth = this.basePark.width * 1.4;
        this._parkHeight = this.basePark.height * 1.4;
        this.basePark.active = false;
        this.parkLayer.removeAllChildren();
        this._initPark(GameData.playerInfo.parkArr);

        //倒计时落船
        this.boatLayer.destroyAllChildren();
        this._autoCreateBoat();
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
        cc.log('1');
        this.scheduleOnce(this._createBoat, 5);
    },
    //获取空闲船位数组
    _getEmptyParkArr() {
        let emptyParkArr = [];
        let parkArr = GameData.playerInfo.parkArr;
        console.log('====parkArr====: ', parkArr);
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
        cc.log('2');
        if (this._isParkFull()) return;
        cc.log('3');
        let emptyParkArr = this._getEmptyParkArr();
        let len = emptyParkArr.length;
        let randIndex = Math.floor(cc.random0To1() * len);
        let pos = this._getParkPos(randIndex);
        let boatPreNode = cc.instantiate(this.boatPre);
        this.boatLayer.addChild(boatPreNode);
        boatPreNode.x = pos.x;
        boatPreNode.y = cc.view.getVisibleSize().height;
        let moveAct = cc.moveTo(0.5, pos).easing(cc.easeInOut(3.0));
        let statusData = {
            index: randIndex,
            status: 1
        };
        let cbAct = cc.callFunc(this._updateParkStatus, this, statusData);
        boatPreNode.runAction(cc.sequence(moveAct, cbAct));
    },
    //获取具体索引的船位坐标
    _getParkPos(index) {
        let parkPosArr = this._getParkPosArr(GameData.playerInfo.parkArr);
        return parkPosArr[index];
    },
    //更新已有船位状态
    _updateParkStatus(node, statusData) {
        console.log('====statusData====: ', statusData);
    }
});