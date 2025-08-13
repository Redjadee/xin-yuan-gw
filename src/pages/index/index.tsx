import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import MessageContainer from './components/MessageContainer/MessageContainer'

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
