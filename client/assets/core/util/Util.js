module.exports = {
    //将node的层级调整为Parent下最高级，node不是脚本，是预制
    reZOrderToTop(node) {
        let parent = node.parent;
        let childrenCount = parent.childrenCount;
        node.setLocalZOrder(childrenCount);
    }
};