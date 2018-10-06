module.exports = {
    //将node的层级调整为Parent下最高级，node不是脚本，是预制
    reZOrderToTop(node) {
        let parent = node.parent;
        let childrenCount = parent.childrenCount;
        node.setLocalZOrder(childrenCount);
    },

    //获取本地存储
    getStorage(str) {
        let storage = cc.sys.localStorage.getItem(str);
        return JSON.parse(storage);
    },

    setStorage(str, obj) {
        cc.sys.localStorage.setItem(str, JSON.stringify(obj));
    },

    //格式化数字
    numberFormat(number) {
        return numeral(number).format('0a').toUpperCase();
    }
};