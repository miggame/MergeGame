window.GameLocalMsg = {
    Msg: {
        UpdateUserinfo: 'GameLocalMsg_UpdateUserinfo',
        ResetTopBar: 'GameLocalMsg_resetTopBar',
        BoatIsInWay: 'GameLocalMsg_BoatIsInWay', //检测船是否与航道相交
        BoatGoBack: 'GameLocalMsg_BoatGoBack', //返回原位置,
        PushBoatInWay: 'GameLocalMsg_PushBoatInWay', //把船推送到航道上,
        PullBoatBackPark: 'GameLocalMsg_PullBoatBackPark', //收回船到船位上
        ParkShowBoatShadow: 'GameLocalMsg_ParkShowBoatShadow', //在船位层的船位上显示船只阴影
        ParkHideBoatShadow: 'GameLocalMsg_ParkHideBoatShadow', //在船位层的船位上隐藏船只阴影
        MergeBoat: 'GameLocalMsg_MergeBoat' //合并船只或者交换位置
    }
}