import { View, Text, Image } from "@tarojs/components"
import { useState, useEffect } from 'react'
import { useLoad } from '@tarojs/taro'
import { dateFormater } from "@/global/utils/common"

import './index.scss'

interface notifiPropsType {
  type: 'time' | 'result'
}

function Notification({ type }: notifiPropsType) {
  if(type === 'time') {
    return (
      <Text className="notifi">{dateFormater('2025-03-12')}</Text>
    )
  } else if (type === 'result') {
    return (
      <View className="notifi-bg">
        <Text className="notifi"></Text>
      </View>
    )
  }
}

interface chatBubblePropsType {
  type: 'left' | 'right'
}

function ChatBubble({ type }: chatBubblePropsType) {
  if(type === 'left') {
    return (
      <View className="chat-bubble left">
        <Image className="profile" src="" />
        <View className="bubble">
          <Text></Text>
        </View>
      </View>
    )
  } else {
    return (
      <View className="chat-bubble right">
        <View className="bubble">
          <Text></Text>
        </View>
        <Image className="profile" src="" />
      </View>
    )
  }
}

export default function Chat() {
  const [ fromid, setFromid ] = useState('')
  useLoad(options => {
    setFromid(options.id)
  })
  
  return (
    <View className="chat">
      <Text className="title">王同学</Text>
      
    </View>
  )
}