import { View, Text, Image } from '@tarojs/components'
import './index.scss'
import profile from '../../../../temp/images/profile.jpg'

interface MsgType {
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

export default function MessageContainer() {
  const dataList: MsgType[] = [
    {
      profileHref: '', //~pending: 没加载出来图片 的防御性编程
      name: '名字',
      content: '内容', //~pending: 内容过长的逻辑
      time: '刚刚'
    }
  ] //~pending: 请求数据
  return (
    <View>
      {dataList.map((value, index) => (
        <Message {...value} key={`home-msg-${index}`}/>
      ))}
    </View>
  )
}
//