import { View, Text, Image } from '@tarojs/components'
import { TextEllipsis } from '@taroify/core'
import '@taroify/core/text-ellipsis/index.css'
import { dateFormater } from '@/global/utils/common'
import Taro from '@tarojs/taro'
import { MessageItem } from '@/msgPkg/pages/chat'

import './index.scss'
import { useCallback, useMemo } from 'react'

export interface MsgShowType {
  content: string
  contenttype: 1 | 2 | 3 | 4 | 5 //内容类型: 1-文本 2-图片 3-语音 4-视频 5-文件
  
  fromuseravatar: string //头像图片链接
  fromusername: string
  fromuserid: string //发送者用户ID
  id: string

  isread: 0 | 1 //0-未读 1-已读
  createdat: string

  messageitems: MessageItem[]
}

function Message({ fromuseravatar, fromusername, content, createdat: time, fromuserid, id, messageitems }: MsgShowType) {
  const key = useMemo(() => {
    if(messageitems) return messageitems.filter(val => val.itemkey === 'messagetype')
    else return [{ itemvalue: 'broadcast' }]
  }, [messageitems])
  const handleRouter = useCallback(() => Taro.navigateTo({ url: `/msgPkg/pages/chat/index?id=${fromuserid || id}&type=${key[0].itemvalue}&title=${fromusername}` }) , [key, fromuserid, fromusername, id])
  
  return (
    <View className='msg' onClick={handleRouter}>
      <Image src={fromuseravatar} className='profile' />
      <View className='middle-box'>
        <Text className='name'>{fromusername}</Text>
        <TextEllipsis className='content' content={content} />
      </View>
      <Text className='time'>{dateFormater(time)}</Text> 
    </View>
  )
}

interface propsType {
  dataList: MsgShowType[]
}

export default function MessageContainer({ dataList }: propsType) {
  return (
    <View className='msg-container'>
      {dataList.map((value, index) => (
        <Message {...value} key={`home-msg-${index}`}/>
      ))}
    </View>
  )
}
//