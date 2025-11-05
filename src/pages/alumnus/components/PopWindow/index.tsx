import { View, Text } from "@tarojs/components"
import { useMemo } from "react"

import './index.scss'

//TODO 禁止滑动

type propsType = {
  closePop: (type: boolean) => void
  type: '关注用户' | '报名活动' | '退出组织' | '不可查看' | '注销'
}

export default function PopWindow({ closePop, type }: propsType) {
  
  const labels = useMemo(() => {
    switch(type) {
      case '关注用户': return ['确定取消关注？', '狠心离开', '取消']
      case '报名活动': return ['确定取消报名？', '狠心离开', '取消']
      case '退出组织': return ['确定退出组织？', '狠心离开', '取消']
      case '不可查看': return ['对方设置了不可查看', '', '确定']
      case '注销': return ['确定注销账号？', '确定', '取消']
    }
  }, [type])
  
  return (
    <View className="pop-window-bg">
      <View className="pop-window">
        <View className="upper-box">
          <Text className="confirm">{labels[0]}</Text>
        </View>
        <View className="under-box">
          { type !== '不可查看' && <Text className="yes" onClick={() => closePop(true)}>{labels[1]}</Text>}
          <Text className="no" onClick={() => closePop(false)}>{labels[2]}</Text>
        </View>
      </View>
    </View>
  )
}