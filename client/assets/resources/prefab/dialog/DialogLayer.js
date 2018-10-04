// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        btnOk: {
            displayName: 'btnOk',
            default: null,
            type: cc.Button
        },
        btnCancel: {
            displayName: 'btnCancel',
            default: null,
            type: cc.Button
        },
        btnClose: {
            displayName: 'btnClose',
            default: null,
            type: cc.Button
        },
        lblTips: {
            displayName: 'lblTips',
            default: null,
            type: cc.Label
        },
        _okCb: null,
        _cancelCb: null,
        _closeCb: null,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    showTipsWithOkCancelBtn(word, okCb, cancelCb, closeCb) {
        this.btnOk.node.active = true;
        this.btnCancel.node.active = true;
        this.lblTips.string = word;

        this._okCb = okCb;
        this._cancelCb = cancelCb;
        this._closeCb = closeCb;
    },

    showTipsWithOkBtn(word, okCb, cancelCb, closeCb) {
        this.btnOk.node.active = true;
        this.btnCancel.node.active = false;
        this.lblTips.string = word;

        this._okCb = okCb;
        this._cancelCb = cancelCb;
        this._closeCb = closeCb;
    },

    showTipsWithOkBtnAndNoCloseBtn(word, okCb, cancelCb, closeCb) {
        this.btnOk.node.active = true;
        this.btnCancel.node.active = false;
        this.btnClose.node.active = false;
        this.lblTips.string = word;

        this._okCb = okCb;
        this._cancelCb = cancelCb;
        this._closeCb = closeCb;
    },

    setCloseBtnVisible(b) {
        this.btnClose.node.active = b;
    },

    onClickBtnToOk() {
        if (this._okCb) {
            this._okCb();
        }
        if (this.node) {
            this.node.destroy();
        }
    },

    onClickToBtnCancel() {
        if (this._cancelCb) {
            this._cancelCb();
        }
        if (this.node) {
            this.node.destroy();
        }
    },

    onClickToBtnClose() {
        if (this._closeCb) {
            this._closeCb();
        }
        if (this.node) {
            this.node.destroy();
        }
    }
});