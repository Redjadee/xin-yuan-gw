import { View, Text, Image } from "@tarojs/components"
import { useState, useEffect, useMemo } from 'react'
import { useLoad } from '@tarojs/taro'
import { dateFormater, showMsg } from "@/global/utils/common"
import { conversation } from "@/global/utils/api/usercenter/message"

import './index.scss'

export interface MessageItem {
  createdat: string
  id: string
  itemkey: string
  itemvalue: string
  messageid: string
  updatedat: string
}
interface conversationType {
  content: string
  contenttype?: 1 | 2 | 3 | 4 | 5 //内容类型: 1-文本 2-图片 3-语音 4-视频 5-文件
  
  fromuseravatar?: string //头像图片链接
  fromusername?: string
  fromuserid?: string //发送者用户ID

  isread?: 0 | 1 //0-未读 1-已读
  createdat: string

  messageitems?: MessageItem[]
}

function Notification({val}) { //TODO
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

function ChatChild(val: conversationType) {
  const type = useMemo(() => {
    if(!val.messageitems) return 'left'
    const key = val.messageitems.filter((val) => val.itemkey === 'show_direction')
    if(key[0].itemvalue === 'send') return 'right'
    else return 'left'
  }, [val])
  return (
    <>
      <Time val={val.createdat}  />
      <Bubble type={type} content={val.content} avatar={val.fromuseravatar || ''} />
    </>
  )
}

export default function Chat() {
  const [ from, setFrom ] = useState({ id: '', type: '', title: ''})
  const [ fromChanged, setFromChanged ] = useState(false)
  useLoad(options => {
    setFrom({id: options.id || '', type: options.type, title: options.title })
    setFromChanged(true)
  })

  const [ list, setList ] = useState<conversationType[]>([])
  useEffect(() => {
    const controller = new AbortController()

    const getContent = async () => {
      const res = await conversation(from.id, from.type as 'personal' | 'activity' | 'broadcast', controller.signal)
      if(res?.data) {
        setList(res.data.messages)
        console.log(res.data)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    if(fromChanged) getContent()

    return () => controller.abort()
  }, [fromChanged])

  return (
    <View className="chat">
      <Text className="title">{from.title}</Text>
      {[...list].reverse().map((val, index) => <ChatChild {...val} key={`chatChild-${list.length - 1 - index}`} />)}
    </View>
  )
}