let ObserverMgr = require('ObserverMgr');
module.exports = {
    _isInit: false,
    _maskNode: null,
    _maskIndex: 0,

    preload() {
        cc.loader.loadRes('prefab/netMask/NetMaskLayer');
        console.log('preload');
    },

    initEvent() {
        if (this._isInit !== false) {
            console.log('[NetMaskModule] has init');
            return;
        }
        this._isInit = true;
        ObserverMgr.removeEventListenerWithObject(this);
        ObserverMgr.addEventListener(GameMsgGlobal.Net.DisConn, this._onNetReceive, this);
        ObserverMgr.addEventListener(GameMsgGlobal.Net.TimeOut, this._onNetReceive, this);
        ObserverMgr.addEventListener(GameMsgGlobal.Net.Recv, this._onNetReceive, this);
        ObserverMgr.addEventListener(GameMsgGlobal.Net.Send, this._onNetSend, this);
        return;
    },

    _customMask: null,
    //自定义添加的加载遮罩
    customAddMask() {
        let scene = cc.director.getScene();
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        cc.loader.loadRes('prefab/netMask/NetMaskLayer', (err, prefab) => {
            if (err) {
                console.log('err: ', err);
                return;
            }
            if (this._customMask !== null) {
                if (this._customMask.isValid) {
                    this._customMask.destroy();
                }
                this._customMask = null;
            }
            let layer = cc.instantiate(prefab);
            layer.x = w / 2;
            layer.y = h / 2;
            scene.addChild(layer);
            this._customMask = layer;
        });
    },

    _onNetReceive(msg, data) {
        this._maskIndex--;
        if (this._maskIndex <= 0) {
            this._maskIndex = 0;
            if (this._maskNode === null) {

            } else {
                if (this._maskNode.isValid) {
                    this._maskNode.destroy();
                }
                this._maskNode = null;
            }
        }
    },
    _onNetSend(msg, data) {
        this._maskIndex++;
        if (this._maskNode === null) {
            let scene = cc.director.getScene();
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            cc.loader.loadRes('prefab/netMask/NetMaskLayer', (err, prefab) => {
                if (err) {
                    console.log('err: ', err);
                    return;
                }
                if (this._maskNode === null && this._maskIndex > 0) {
                    let layer = cc.instantiate(prefab);
                    layer.x = w / 2;
                    layer.y = h / 2;
                    scene.addChild(layer);
                    this._maskNode = layer;
                }
            });
        } else {
            let children = this._maskNode.parent.children;
            if (children !== null) {
                let childrenCount = children.length;
                this._maskNode.setLocalZOrder(childrenCount);
            } else {
                console.log('[NetMaskModule] children = null');
            }
        }
    }
};