let UIMgr = require('UIMgr');
let GameData = require('GameData');
let Util = require('Util');
let NetHttpMgr = require('NetHttpMgr');
let Observer = require('Observer');
let ObserverMgr = require('ObserverMgr');
cc.Class({
    extends: Observer,

    properties: {
        _count: null,
        _divisor: null,
        _min: null,
        _max: null,
        _goldCost: null,
        lblCostGold: {
            displayName: 'lblCostGold',
            default: null,
            type: cc.Label
        },
        // lblCount: {
        //     displayName: 'lblCount',
        //     default: null,
        //     type: cc.Label
        // },
        editBox: {
            displayName: 'editBox',
            default: null,
            type: cc.EditBox
        },
        btnExchange: {
            displayName: 'btnExchange',
            default: null,
            type: cc.Button
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameMsgHttp.Msg.ExchangeMedal.msg
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameMsgHttp.Msg.ExchangeMedal.msg) {
            this._refreshCost(true);
        }
    },
    onLoad() {
        this._initMsg();
        this._refreshCost(true);
    },

    start() {

    },

    // update (dt) {},
    _refreshCost(flag) {
        this._divisor = 10000;
        this._getMax();
        if (this._max <= this._min) {
            this._max = this._min;
        }
        this._min = 1;
        if (flag !== undefined) {
            this._count = 1;
        }
        this._goldCost = this._count * this._divisor;
        this.editBox.string = this._count;
        this.lblCostGold.string = Util.numberFormat(this._goldCost);

        this.btnExchange.interactable = GameData.playerInfo.gold >= this._goldCost;
    },

    onBtnClickToClose() {
        ObserverMgr.dispatchMsg(GameLocalMsg.Msg.ResetTopBar, true);
        UIMgr.destroyUI(this);
    },

    onBtnClickToMinus() {
        this._count--;
        if (this._count <= this._min) {
            this._count = this._min;
        }
        this._refreshCost();
    },
    onBtnClickToPlus() {
        this._getMax();
        this._count++;
        if (this._count >= this._max) {
            this._count = this._max;
        }
        this._refreshCost();
    },
    onBtnClickToMin() {
        this._count = this._min;
        this._refreshCost();
    },
    onBtnClickToMax() {
        this._getMax();
        this._count = this._max;
        this._refreshCost();
    },

    onBtnClickToExchange() { //传值有正负之分
        let sendData = {
            userId: GameData.playerInfo.userId,
            gold: -this._goldCost,
            medal: this._count
        };
        NetHttpMgr.quest(GameMsgHttp.Msg.ExchangeMedal, sendData);
    },

    onEditBoxToChanged() {
        this._count = parseInt(this.editBox.string);
        if (this._count < this._min) {
            this._count = this._min;
            this.editBox.string = this._count;
        }
        this._getMax();
        if (this._count > this._max) {
            this._count = this._max;
            this.editBox.string = this._count;
        }
        this._refreshCost();
    },

    _getMax() {
        let gold = GameData.playerInfo.gold;
        this._max = Math.round(gold / this._divisor);
    }
});