module.exports = {
    //获取网络状态
    //android java:

    //IOS: (需要Reachability.h 和 Reachability.m， 可以去苹果下载，或者用附件里我用的Reachability.rar11(2.8 KB))
    // -1：nonetwork, 0：未知, 1：wifi， 2：mobile， 3：net
    // int getNetWorkType() {
    //     Reachability * reach = [Reachability reachabilityForInternetConnection];
    //     int iType = 0;
    //     switch ([reach currentReachabilityStatus]) {
    //         case NotReachable: //没有网络
    //             iType = -1;
    //             break;
    //         case ReachableViaWifi: //Wifi
    //             iType = 1;
    //             break;
    //         case ReachableViaWWAN: //手机自带网络
    //             iType = 2;
    //             break;
    //     }
    //     return iType;
    // }

    getNetIsConnect() {
        if (cc.sys.isBrowser) {
            return navigator.onLine; //返回浏览器联网状态
        }
        if (cc.sys.isNative) {
            if (cc.sys.platform === cc.sys.ANDROID) {
                return;
            }
            if (cc.sys.platform === cc.sys.IPAD || cc.sys.platform === cc.sys.IPHONE) {
                return;
            }
        }
        return true;
    }
};