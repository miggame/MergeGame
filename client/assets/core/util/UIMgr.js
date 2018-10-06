module.exports = {
    _uiMap: {},
    /*
    * 使用实例:
    * UIMgr.createPrefabToRunningScene(this.userInfoLayer, function (ui) {
            // ui 为实例化Prefab
        }.bind(this));
    * */
    createPrefabToRunningScene(UIPrefab, createCallBack) {
        if (!UIPrefab) {
            console.log('[UIMgr] 无法创建Prefab: ', UIPrefab);
            return;
        }
        cc.loader.loadRes('prefab/ComUIBg', (err, prefab) => {
            let nodeBg = cc.instantiate(prefab);
            let scriptBg = nodeBg.getComponent('ComUIBg');
            if (scriptBg) {
                let uiNode = scriptBg.addUI(UIPrefab);
                let uuid = uiNode.uuid.toString();
                this._uiMap[uuid] = nodeBg;
                let scene = cc.director.getScene();
                if (scene) {
                    let w = cc.view.getVisibleSize().width;
                    let h = cc.view.getVisibleSize().height;
                    nodeBg.x = w / 2;
                    nodeBg.y = h / 2;
                    scene.addChild(nodeBg);
                    if (createCallBack) {
                        createCallBack(uiNode);
                    }
                    return;
                }
                console.log('[UIMgr] 没有运行Scene，无法添加UI界面');
            }
        });
    },

    destroyUI(script) {
        if (script) {
            if (script.node) {
                let uuid = script.node.uuid.toString();
                let rootNode = this._uiMap[uuid];
                if (rootNode) {
                    rootNode.destroy();
                    this._uiMap[uuid] = null;
                    return;
                }
                console.log('[UIMgr] ' + script.name + ' 没有node属性');
                return;
            }
            console.log('[UIMgr] ' + script.name + ' 没有node属性');
            return;
        }
        console.log('[UIMgr] 缺少参数');
    },
    /*
    * 使用实例:
    * UIMgr.createPrefab(this.userInfoLayer, function (root, ui) {
            this.uiNode.addChild(root);
        }.bind(this));
    * */
    createPrefab(UIPrefab, createCallBack) {
        if (!UIPrefab) {
            console.log('[UIMgr] 无法创建Prefab: ', UIPrefab);
            return;
        }
        cc.loader.loadRes('prefab/ComUIBg', (err, prefab) => {
            if (!err) {
                let nodeBg = cc.instantiate(prefab);
                let scriptBg = nodeBg.getComponent('ComUIBg');
                if (scriptBg) {
                    let uiNode = scriptBg.addUI(UIPrefab);
                    let uuid = uiNode.uuid.toString();
                    this._uiMap[uuid] = nodeBg;
                    if (createCallBack) {
                        createCallBack(nodeBg, uiNode);
                    }
                }
            }
        })
    }
};