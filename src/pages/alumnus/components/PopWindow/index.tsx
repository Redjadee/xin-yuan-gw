import { View, Text } from "@tarojs/components";

import './index.scss'

//TODO 禁止滑动

type propsType = {
  closePop: (type: boolean) => void
}

export default function PopWindow({ closePop }: propsType) {
  return (
    <View className="pop-window-bg">
      <View className="pop-window">
        <View className="upper-box">
          <Text className="confirm">确定取消关注？</Text>
        </View>
        <View className="under-box">
          <Text className="yes" onClick={() => closePop(true)}>狠心离开</Text>
          <Text className="no" onClick={() => closePop(false)}>取消</Text>
        </View>
      </View>
    </View>
  )
}