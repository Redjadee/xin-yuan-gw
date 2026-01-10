import { View, Image, Text } from "@tarojs/components"
import Taro from "@tarojs/taro"
import './index.scss'
import { useCallback } from "react"

interface propsType {
  className: string
  id: string
  avatar: string
  name: string
  type: '个人' | '组织'
}

export default function ContactItem({ className, id, avatar, name, type }: propsType) {
  
  const toInfor = useCallback(() => {
    Taro.navigateTo({ url: `/msgPkg/pages/infor/index?type=${type}&id=${id}&status=${true}` })
  }, [type, id])

  return (
    <View className={`contact-item ${className}`} onClick={toInfor} >
      <Image className="avatar" src={avatar} />
      <Text>{name}</Text>
    </View>
  )
}