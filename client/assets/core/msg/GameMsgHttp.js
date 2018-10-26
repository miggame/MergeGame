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
        },
        ExchangeMedal: {
            id: 3001,
            msg: 'exchangeMedal'
        },
        UpdateParkStatus: {
            id: 4001,
            msg: 'updateParkStatus'
        },
        RequestDropBoat: {
            id: 5001,
            msg: 'requestDropBoat'
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