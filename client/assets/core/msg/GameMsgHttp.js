window.GameMsgHttp = {
    Msg: {
        Register: {
            id: 1001,
            msg: 'register'
        },
        SevenDay: {
            id: 2001,
            msg: 'sevenDay'
        },
        UpdateSevenDay: {
            id: 2002,
            msg: 'updateSevenDay'
        }
    },
    getMsgById(id) {
        for (const key in this.Msg) {
            if (this.Msg.hasOwnProperty(key)) {
                const element = this.Msg[key];
                if (element.id === id) {
                    return element.msg;
                }
            }
        }
        return null;
    }
}