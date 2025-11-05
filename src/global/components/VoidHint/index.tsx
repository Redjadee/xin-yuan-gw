import { Text, View, Image } from "@tarojs/components"
import { useMemo, useState } from "react"
import Taro from "@tarojs/taro"
import { useDispatch } from "react-redux"
import { setTabBar } from "@/store/tabBarSlice"

import { myImgBase } from "@/global/assets/images/imgBases"
import './index.scss'

interface propsType {
  type: '活动列表' | '消息列表' | '校友组织列表' | '校友通讯录' | '组织通讯录' | '我的活动'
  className?: string
}

export default function VoidHint({ type, className }: propsType) {
  const dispatch = useDispatch()
  
  const hints = [
    '还没有活动哟，敬请期待吧！',
    '暂无消息',
    '还没有发现哟，敬请期待吧！',
    '还没有校友哟，快去添加吧！',
    '还没有组织哟，快去添加吧！',
    '还没有活动哟，快去报名吧！'
  ]  
  const showHint = useMemo(() => {
    switch (type) {
      case '活动列表': return hints[0]
      case '消息列表': return hints[1]
      case '校友组织列表': return hints[2]
      case '校友通讯录': return hints[3]
      case '组织通讯录': return hints[4]
      case '我的活动': return hints[5]
    }
  }, [type])

  const url = useMemo(() => {
    switch (type) {
      case '组织通讯录': return '/pages/alumnus/index?label=组织'
      case '校友通讯录': return '/pages/alumnus/index?label=校友'
      case '我的活动': return '/activityPkg/pages/allview/index?type=0'
    }
  }, [type])
  const handleRouter = () => {
    dispatch(setTabBar(type === '我的活动' ? 1 : 0))
    console.log(url)
    if(url) Taro.reLaunch({ url })
  }

  if(type === '组织通讯录' || type === '校友通讯录' || type === '我的活动') {
    return (
      <View className={`void-hint ${className}`}>
        <Text>{showHint}</Text>
        <View className="below-box" onClick={handleRouter}>
          <Text>去添加</Text><Image className="arrow" src={`${myImgBase}/itemArrow.png`} />
        </View>
      </View>
    )
  } else {
    return (
      <Text className={`void-hint ${className}`}>{showHint}</Text>
    )
  }
}