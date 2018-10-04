module.exports = {
    obsArray: {},
    //注册事件
    addEventListener: function(msg, func, ob) {
        if(typeof ob === "undefined") {
            cc.log("[ObserverMgr] 注册消息 [%s]: %s 的作用域未定义", msg, func.name);
            //return;       ???
        }
        let obs = this.obsArray[msg];       //对象
        if(typeof obs === "undefined") {
            this.obsArray[msg] = [];        //此数组中存放的是对应msg对象eg: {func: a, ob: b}
        }

        //当重复的事件重复回调注册时，不予注册 fixme 匿名函数还是会重复注册  ???
        for(let item of this.obsArray[msg]) {
            if(item['func'] === func && item['ob'] === ob) {
                cc.log("重复注册" + msg + ":" + func);
                return;
            }
        }

        this.obsArray[msg].push({func: func, ob: ob});
    },

    //取消注册事件
    removeEventListener: function(msg, func, ob) {
        let b = false;
        let msgCBArray = this.obsArray[msg];
        if(msgCBArray != undefined) {
            for(let item of this.obsArray[msg]) {
                if(item['ob'] === ob && item['func'] === func) {
                    msgCBArray.splice(this.obsArray[msg].indexOf(item), 1);
                    b = true;
                }
            }
        }
        return b;
    },

    //移除该作用域的所有事件
    removeEventListenerWithObject: function(ob) {
        // for(let msgCBArray of this.obsArray) {       //此方法不对，因为obsArray是对象，不具备iterator
        //     for(let msgCBItem of msgCBArray) {
        //         if(msgCBItem['ob'] === ob) {
        //             msgCBArray.splice(msgCBArray.indexOf(msgCBItem), 1);
        //         }
        //     }
        // }

        for(let k in this.obsArray) {   //[msg:[{func: func, ob: ob}]]
            let msgCBArray = this.obsArray[k];  //[{func: func, ob: ob}]
            for(let i = 0; i<msgCBArray.length;) {
                let msgCBItem = msgCBArray[i];
                if(msgCBItem['ob'] === ob) {
                    msgCBArray.splice(i, 1);
                } else {
                    i++;
                }
            }

        }
    },

    dispatchMsg: function(msg, data) {
        let obs = this.obsArray[msg];
        if(typeof obs!= "undefined") {
            for(let item of obs) {
                let func = item['func'];
                let ob = item['ob'];
                if(func && ob) {
                    //call必须是object
                    //apply必须是array
                    func.apply(ob, [msg, data]);
                }
            }
        } else {
            cc.log("消息列表中不存在："+ msg);
        }
    }
}