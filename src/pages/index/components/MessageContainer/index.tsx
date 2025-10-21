import { View, Text, Image } from '@tarojs/components'
import { dateFormater } from '@/global/utils/common'

import './index.scss'

export interface MsgShowType {
  content: string
  contenttype: 1 | 2 | 3 | 4 | 5 //内容类型: 1-文本 2-图片 3-语音 4-视频 5-文件
  
  profileHref: string //头像图片链接
  name: string
  
  isread: 0 | 1 //0-未读 1-已读
  createdat: string
}

function Message({ profileHref, name, content, createdat: time }: MsgShowType) {
  return (
    <View className='msg'>
      <Image src={profileHref} className='profile' />
      <View className='middle-box'>
        <Text className='name'>{name}</Text>
        <Text className='content'>{content}</Text>
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