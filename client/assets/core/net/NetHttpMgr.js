let Native = require('Native');
let ObserverMgr = require('ObserverMgr');
let GameNetCfg = require('GameNetCfg');
let DialogMgr = require('DialogMgr');

module.exports = {
    _tmpQuest: {
        msg: null,
        data: null
    },
    quest(msg, data) {
        this._tmpQuest.msg = msg;
        this._tmpQuest.data = data;

        if (Native.getNetIsConnect() === false) {
            ObserverMgr.dispatchMsg(GameMsgGlobal.Net.DisConn, null);
            return;
        }

        let url = GameNetCfg.getHttpUrl();
        this._showSendData(msg, data);

        let xhr = new XMLHttpRequest();
        xhr.ontimeout = this._onTimeOut.bind(this);
        xhr.timeout = 6000;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                let text = xhr.responseText;
                let result = JSON.parse(text);
                ObserverMgr.dispatchMsg(GameMsgGlobal.Net.Recv, result);
                let msgID = result[0];
                let msgCode = result[1];
                let msgData = result[2];

                this._showRecvData(msgStr, msgCode, msgData);

                if (msgCode !== undefined && msgStr !== null) {
                    if (msgCode === GameMsgGlobal.NetCode.SuccessHttp.id) {
                        ObserverMgr.dispatchMsg(msgStr, msgData);
                        return;
                    }
                    return ObserverMgr.dispatchMsg(GameMsgGlobal.Net.MsgErr, result);
                }
                console.log('[Http] 缺少code字段');
                return;
            }
            console.log('NetHttpMgr error : ', xhr.readyState);
            return;
        }

        xhr.onerror = (err) => {
            ObserverMgr.dispatchMsg(GameMsgGlobal.Net.DisConn, null);
            this._onTimeOut();
        }

        let enCodeData = {
            msg_id: msg.id,
            data: data
        };
        let sendData = DataEncode.encodeHttp(enCodeData);
        let dataStr = JSON.stringify(sendData);
        xhr.open('post', url, true);
        ObserverMgr.dispatchMsg(GameMsgGlobal.Net.Send, null);

        try {
            xhr.send(dataStr);
        } catch (e) {
            console.log('e: ', e);
        }
    },

    _showSendData(msg, data) {
        let dataStr = data;
        let msgStr = msg.msg;
        let sendData = {
            time: this._getTime(),
            msg: msgStr,
            data: dataStr
        };
        if (cc.sys.isBrowser) {
            console.log('[Http===>]%c %s', "color:green; font-weight:bold;", JSON.stringify(sendData));
        }
    },

    _getTime() {
        return dayjs().format('HH:mm:ss');
    },

    _onTimeOut() {
        console.log('[Http] %c连%c接%c超%c时', 'color:red', 'color:orange', 'color:purple', 'color:green');
        ObserverMgr.dispatchMsg(GameMsgGlobal.Net.TimeOut, null);

        DialogMgr.showTipsWithOkBtnAndNoCloseBtn(
            'net connect failed, try again?',
            () => {
                //重新请求之前的数据
                let msg = this._tmpQuest.msg;
                let data = this._tmpQuest.data;
                if (msg !== null && data !== null) {
                    this.quest(msg, data);
                }
            },
            null,
            function (node) {
                require('Util').reZOrderToTop(node);
            }
        );
    },

    _showRecvData(msg, code, data) {
        let recvData = {
            time: this._getTime(),
            msg: msg,
            code: code,
            data: data
        };
        if (cc.sys.isBrowser) {
            console.log('[Http<===]%c %s', 'color:blue;font-weight:bold;', JSON.stringify(recvData));
        } else {
            console.log('[Http<===]%s', JSON.stringify(recvData));
        }
    }
};