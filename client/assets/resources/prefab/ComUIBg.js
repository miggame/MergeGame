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
        bgNode: {
            displayName: 'bgNode',
            default: null,
            type: cc.Node
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        this.bgNode.width = w;
        this.bgNode.height = h;
    },

    start() {

    },

    // update (dt) {},
    addUI(ui) {
        let node = cc.instantiate(ui);
        node.x = node.y = 0;
        this.node.addChild(node);
        return node;
    }
});