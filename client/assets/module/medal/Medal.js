let UIMgr = require('UIMgr');
let GameData = require('GameData');
let Util = require('Util');

cc.Class({
    extends: cc.Component,

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

    onLoad() {
        this._refreshCost(true);
    },

    start() {

    },

    // update (dt) {},
    _refreshCost(flag) {
        this._divisor = 10000;
        let gold = GameData.playerInfo.gold;
        this._max = Math.round(gold / this._divisor);
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

        this.btnExchange.interactable = gold >= this._goldCost;
    },

    onBtnClickToClose() {
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
        this._count = this._max;
        this._refreshCost();
    }
});