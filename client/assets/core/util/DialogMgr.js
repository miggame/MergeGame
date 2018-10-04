module.exports = {
    showTipsWithOkBtn(word, okCb, cancelCb, closeCb) {
        //可以考虑在此处加音乐
        let scene = cc.director.getScene();
        if (scene) {
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            cc.loader.loadRes('prefab/dialog/DialogLayer', (err, prefab) => {
                if (err) {
                    console.log('err: ', err);
                    return;
                }
                let layer = cc.instantiate(prefab);
                layer.x = w / 2;
                layer.y = h / 2;
                scene.addChild(layer);
                let script = layer.getComponent('DialogLayer');
                if (script) {
                    script.showTipsWithOkBtn(word, okCb, cancelCb, closeCb);
                }
            });
        }
    },

    showTipsWithOkBtnAndNoCloseBtn(word, okCb, cancelCb, showCb) {
        //添加声音
        let scene = cc.director.getScene();
        if (scene) {
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            cc.loader.loadRes('prefab/dialog/DialogLayer', (err, prefab) => {
                if (err) {
                    console.log('err: ', err);
                    return;
                }
                let layer = cc.instantiate(prefab);
                layer.x = w / 2;
                layer.y = h / 2;
                scene.addChild(layer);
                let script = layer.getComponent('DialogLayer');
                if (script) {
                    script.showTipsWithOkBtn(word, okCb, cancelCb);
                    script.setCloseBtnVisible(false);
                }
                if (showCb) {
                    showCb(layer);
                }
            });
        }
    },

    showTipsWithOkCancelBtn(word, okCb, cancelCb, closeCb, showCb) {
        //添加声音
        let scene = cc.director.getScene();
        if (scene) {
            let w = cc.view.getVisibleSize().width;
            let h = cc.view.getVisibleSize().height;
            cc.loader.loadRes('prefab/dialog/DialogLayer', (err, prefab) => {
                if (err) {
                    console.log('err: ', err);
                    return;
                }
                let layer = cc.instantiate(prefab);
                layer.x = w / 2;
                layer.y = h / 2;
                scene.addChild(layer);
                let script = layer.getComponent('DialogLayer');
                if (script) {
                    script.showTipsWithOkCancelBtn(word, okCb, cancelCb, closeCb);
                }
                if (showCb) {
                    showCb();
                }
            });
        }
    }
};