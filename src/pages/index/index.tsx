import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import MessageContainer from './components/MessageContainer/MessageContainer'

import { activityType } from './initData'
import { swiperActivities } from './initData'

import { homeImgBase } from '@/global/assets/images/imgBases'

import './index.scss'

interface HeadType {
  type: '热门活动' | '我的消息'
}



function Head({ type }: HeadType) {
  type === '热门活动' ? 1 : 2 //~pending: 路由设置

  return (
    <View className='head'>
      <Text className='title'>{type}</Text>
      <View className='all-button' onClick={() => {}}>
        <Text>全部</Text>
        <Image src={`${homeImgBase}/headArrow.png`} className='arrow' />
      </View>
    </View>
  )
}
//


function HotActivities() {
  const activityList: activityType[] = swiperActivities //~pending: 请求数据
  return (
    <Swiper className='swiper' indicatorDots={true} indicatorColor='#DFCACA' indicatorActiveColor='#0184B2' autoplay={true} interval={3000} circular={true} >
      {activityList.map((value, index) => (
        <SwiperItem key={`home-hotact-swiper${index}`} className='swiper-item'>
          <Image src={value.imgHref} className='img' />
          <Image src={`${homeImgBase}/actiMengBan`} className='mengban' />
          <View className='label-box'>
            <Text className='name'>{value.name}</Text>
            <Text className='time' >{value.time}</Text>
          </View>
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
        <Image src={`${homeImgBase}/bgimg.png`} className='bg-img' />
        <View className='logo-box'>
          <Image src={`${homeImgBase}/GDUFS.png`} className='GDUFS'/>
          <Text className='label' >信息学院校友会</Text>
        </View>
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
