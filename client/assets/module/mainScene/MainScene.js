let Observer = require('Observer');
let UIMgr = require('UIMgr');
let NetHttpMgr = require('NetHttpMgr');
let GameData = require('GameData');
let DialogMgr = require('DialogMgr')
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
        _boatTouchFlag: false,
        //停船位层
        wayLayout: {
            displayName: 'wayLayout',
            default: null,
            type: cc.Node
        },
        wayPre: {
            displayName: 'wayPre',
            default: null,
            type: cc.Prefab
        },
        lblWay: {
            displayName: 'lblWay',
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameMsgHttp.Msg.SevenDay.msg,
            GameMsgHttp.Msg.UpdateParkStatus.msg,
            GameMsgHttp.Msg.RequestDropBoat.msg,
            GameMsgHttp.Msg.RequestDropBoatInRecord.msg
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameMsgHttp.Msg.UpdateParkStatus.msg) {
            console.log('====data====: ', data);
            GameData.playerInfo.parkArr = data;
            this._autoCreateBoat();
        } else if (msg === GameMsgHttp.Msg.RequestDropBoat.msg) {
            if (data === null) {
                console.log('====没有空闲位====');
                return;
            }
            this._createDropBoat(data);
        } else if (msg === GameMsgHttp.Msg.RequestDropBoatInRecord) {
            if (data === null) {
                return;
            }
            console.log('====data====: ', data);
        }
    },

    _onError(msg, code, data) {

    },

    onLoad() {
        this._initMsg();
        //初始化停船位
        this._parkWidth = this.basePark.width * 1.4;
        this._parkHeight = this.basePark.height * 1.4;
        this.basePark.active = false;
        this.parkLayer.removeAllChildren();
        this.boatLayer.destroyAllChildren();
        this._initPark(GameData.playerInfo.parkArr);
        //判定是否有空船位
        if (!this._isParkFull()) { //有空船位时
            // if (this._checkDropCache()) { //dropCache有缓存数据
            //     this._requestDropBoat(1, 1);
            // } else {
            //     this.scheduleOnce(() => {
            //         this._requestDropBoat(1, 1)
            //     }, 5);
            // }
            this._requestDropBoat(1, 1);
        }
        //初始化停船航道
        this._addWay();

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
            //初始化船只
            this._initBoat(data[i].level, parkPosArr[i], data[i].status, data[i].index);
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
    //初始化船
    _initBoat(level, pos, status, index) {
        //判断船位上船只状态
        if (status === -1 || status === 0) return;

        let boatPreNode = cc.instantiate(this.boatPre);
        this.boatLayer.addChild(boatPreNode);
        boatPreNode.position = pos;
        boatPreNode.getComponent('Boat').initView(level, status, index, false);
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
    //获取空闲船位索引数组
    _getEmptyParkIndexArr() {
        let emptyParkIndexArr = [];
        let parkArr = GameData.playerInfo.parkArr;
        let len = parkArr.length;
        for (let i = 0; i < len; ++i) {
            if (parkArr[i].status === 0) emptyParkIndexArr.push(parkArr[i].index);
        }
        return emptyParkIndexArr;
    },
    //判定是否有空船位
    _isParkFull() {
        return this._getEmptyParkArr().length === 0 ? true : false;
    },
    //请求创建船只
    _requestDropBoat(type, num) {
        let sendData = {
            userId: GameData.playerInfo.userId,
            type: type, //type:1普通掉落 2奖励掉落
            num: num //掉落数量
        };
        NetHttpMgr.quest(GameMsgHttp.Msg.RequestDropBoat, sendData);
    },
    //创建掉落船只
    _createDropBoat(data) {
        for (const iter of data) {
            let pos = this._getParkPos(iter.index);
            let boatPreNode = cc.instantiate(this.boatPre);
            this.boatLayer.addChild(boatPreNode);
            boatPreNode.getComponent('Boat').initView(iter.level);
            boatPreNode.x = pos.x;
            boatPreNode.y = cc.view.getVisibleSize().height;
            let moveAct = cc.moveTo(0.5, pos).easing(cc.easeInOut(3.0));
            boatPreNode.runAction(moveAct);
        }
        this.scheduleOnce(() => {
            this._requestDropBoat(1, 1);
        }, 5);
    },

    //获取具体索引的船位坐标
    _getParkPos(index) {
        let parkPosArr = this._getParkPosArr(GameData.playerInfo.parkArr);
        return parkPosArr[index];
    },
    //更新已有船位状态
    _updateParkStatus(node, statusData) {
        console.log('====statusData====: ', statusData);
        let sendData = {
            userId: GameData.playerInfo.userId,
            index: statusData.index,
            status: statusData.status,
            level: statusData.level
        };
        NetHttpMgr.quest(GameMsgHttp.Msg.UpdateParkStatus, sendData);
    },

    //获取掉落船只的级别
    _getDropBoatLevel(maxOwnedBoatLevel) {
        let dropBoatLevel = 0;
        if (maxOwnedBoatLevel === 0) {
            dropBoatLevel = 1;
            return dropBoatLevel;
        }
        let boatData = GameData.gameData.boatShop;
        let giftBoat1 = boatData[maxOwnedBoatLevel].giftBoat1;
        let giftBoat2 = boatData[maxOwnedBoatLevel].giftBoat2;
        let chance1 = boatData[maxOwnedBoatLevel].chance1;
        // let chance2 = boatData[maxOwnedBoatLevel].chance2;

        dropBoatLevel = Math.floor(cc.random0To1() * 100) < chance1 ? giftBoat1 : giftBoat2;
        return dropBoatLevel;
    },

    //初始化boatLayer的操作监听
    _initBoatLayerListener() {
        this.boatLayer.on('touchstart', (event) => {
            console.log('====event====: ', event);
        });

        this.boatLayer.on('touchmove', () => {

        });

        this.boatLayer.on('touchend', () => {

        });

        this.boatLayer.on('touchcancel', () => {

        });
    },

    //判定是否有掉落记录
    _checkDropRecord() {
        let rewardDropNum = this._getRewardDropNum();
        let normalDropNum = this._getNormalDropNum();
        return rewardDropNum > 0 || normalDropNum > 0;
    },

    //判定是否掉落缓存中有数据
    _checkDropCache() {
        var len = this._getDropCache().length; //获取掉落缓存
        return len > 0;
    },

    //获取掉落缓存
    _getDropCache() {
        return GameData.playerInfo.dropCache;
    },
    //初始化航道
    _addWay() {
        let totalWay = GameData.playerInfo.way;
        let numInWay = this._getBoatNumInWay();
        let preWayCount = this.wayLayout.childrenCount;
        for (let i = 0; i < totalWay; ++i) {
            let wayPreNode = cc.instantiate(this.wayPre);
            let index = ++preWayCount;
            this.wayLayout.addChild(wayPreNode, index);
            wayPreNode.getComponent('Way').initView(index, numInWay);
        }
        this.lblWay.node.x = this.wayLayout.x;
        this.lblWay.node.y = this.wayLayout.y + this.wayLayout.height / 2 + this.lblWay.node.height;
        this.lblWay.string = numInWay + '/' + totalWay;
    },

    //获取在航道上的船只数量
    _getBoatNumInWay() {
        let num = 0;
        for (const iter of GameData.playerInfo.parkArr) {
            if (iter.status === 2) {
                num++;
            }
        }
        return num;
    }
});