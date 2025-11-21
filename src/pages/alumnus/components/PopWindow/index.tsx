import { View, Text } from "@tarojs/components"
import { useMemo } from "react"

import './index.scss'

type propsType = {
  closePop: (type: boolean) => void
  type: '关注用户' | '报名活动' | '退出组织' | '不可查看' | '注销' | '删除账号' | '禁用账号' | '修改账号' | '全部通过' | '删除组织'
}

export default function PopWindow({ closePop, type }: propsType) {
  
  const labels = useMemo(() => {
    switch(type) {
      case '关注用户': return ['确定取消关注？', '狠心离开', '取消']
      case '报名活动': return ['确定取消报名？', '狠心离开', '取消']
      case '退出组织': return ['确定退出组织？', '狠心离开', '取消']
      case '不可查看': return ['对方设置了不可查看', '', '确定']
      case '注销': return ['确定注销账号？', '确定', '取消']
      case '删除账号': return ['确定删除账号？', '确定', '取消']
      case '禁用账号': return ['确定禁用账号？', '确定', '取消']
      case '修改账号': return ['确定修改账号？', '确定', '取消']
      case '全部通过': return ['确定全部通过？', '确定', '取消']
      case '删除组织': return ['确定删除组织？', '确定', '取消']
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