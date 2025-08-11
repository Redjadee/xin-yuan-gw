import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

interface HeadType {
  type: '热门活动' | '我的消息'
}
function Head({ type }: HeadType) {
  type === '热门活动' ? 1 : 2 //~pending: 路由设置

  return (
    <View className='head'>
      <Text className='title'>{type}</Text>
      <View className='all-button' onClick={() => {}}>全部 {'>'}</View>
    </View>
  )
}
//


function HotActivities() {
  const activityHrefList: string[] = [''] //~pending: 请求数据
  return (
    <Swiper>
      {activityHrefList.map((value, index) => (
        <SwiperItem key={`home-hotact-swiper${index}`}>
          <Image src={value} />
        </SwiperItem>
      ))}
    </Swiper>
  )
}
//


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

function MessageContainer() {
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


export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <View className='title-img-box'>
        <Image src='' />
      </View>
      <View className='hot-activities'>
        <Head type={'热门活动'} />
        <HotActivities />
      </View>
      <View className='my-messages'>
        <Head type={'我的消息'} />
        <MessageContainer />
      </View>
    </View>
  )
}
