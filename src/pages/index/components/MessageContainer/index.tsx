import { View, Text, Image } from '@tarojs/components'

import './index.scss'

export interface MsgType {
  profileHref: string //头像图片链接
  name: string
  content: string
  time: string //~pending: 类型暂定
}

function Message({ profileHref, name, content, time }: MsgType) {
  return (
    <View className='msg'>
      <Image src={profileHref} className='profile' />
      <View className='middle-box'>
        <Text className='name'>{name}</Text>
        <Text className='content'>{content}</Text>
      </View>
      <Text className='time'>{time}</Text> 
    </View>
  )
}

interface propsType {
  dataList: MsgType[]
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