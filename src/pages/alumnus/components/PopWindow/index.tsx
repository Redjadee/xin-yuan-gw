import { View, Text } from "@tarojs/components";
import type { RootState } from "@/store"
import { useSelector } from "react-redux"

import './index.scss'
import { useMemo } from "react";

//TODO 禁止滑动

type propsType = {
  closePop: (type: boolean) => void
  type: '关注' | '报名'
}

export default function PopWindow({ closePop, type }: propsType) {
  const authStatus = useSelector((state: RootState) => state.auth.isLogged)
  const labels = useMemo(() => 
    authStatus ? [`确定取消${type}？`, '狠心离开', '取消'] : 
    ['暂无权限使用该功能', '取消', '去认证']
  ,[authStatus])
  return (
    <View className="pop-window-bg">
      <View className="pop-window">
        <View className="upper-box">
          <Text className="confirm">{labels[0]}</Text>
        </View>
        <View className="under-box">
          <Text className="yes" onClick={() => closePop(true)}>{labels[1]}</Text>
          <Text className="no" onClick={() => closePop(false)}>{labels[2]}</Text>
        </View>
      </View>
    </View>
  )
}