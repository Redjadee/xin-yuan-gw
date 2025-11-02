import { View, Text, Image } from "@tarojs/components"
import { useState, useEffect } from 'react'
import { useLoad } from '@tarojs/taro'
import { dateFormater, showMsg } from "@/global/utils/common"
import { conversation } from "@/global/utils/api/usercenter/message"
import { MsgShowType } from "@/pages/index/components/MessageContainer"

import './index.scss'


function Notification({val}) {
  return (
    <View className="notifi-bg">
      <Text className="notifi"></Text>
    </View>
  )
}

function Time({val}) {
  return (<Text className="notifi">{dateFormater(val, 'HH:mm')}</Text>)
}
interface chatBubblePropsType {
  type: 'left' | 'right'
  avatar: string
  content: string
}
function Bubble({ type, content, avatar }: chatBubblePropsType) {
  if(type === 'left') {
    return (
      <View className="chat-bubble left">
        <Image className="profile" src={avatar} />
        <View className="bubble">
          <Text>{content}</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View className="chat-bubble right">
        <View className="bubble">
          <Text>{content}</Text>
        </View>
        <Image className="profile" src={avatar} />
      </View>
    )
  }
}

function ChatChild() {
  return (
    <>
      <Time  />
      <Bubble />
    </>
  )
}

export default function Chat() {
  const [ from, setFrom ] = useState({ id: '', type: '' })
  const [ list, setList ] = useState<MsgShowType[]>([])
  useLoad(options => {
    setFrom({id: options.id, type: options.type })
  })
  useEffect(() => {
    const controller = new AbortController()

    const getContent = async () => {
      const res = await conversation(from.id, from.type as 'personal' | 'activity' | 'broadcast', controller.signal)
      if(res?.data) {
        setList(res.data.messages)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getContent()

    return () => controller.abort()
  }, [])

  return (
    <View className="chat">
      <Text className="title">{list[0].fromusername}</Text>
      {list.map((val, index) => <ChatChild />)}
    </View>
  )
}