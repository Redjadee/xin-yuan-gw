import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import MessageContainer from './components/MessageContainer'
import Head from './components/Head'
import { activityType } from './initData'
import { swiperActivities } from './initData'
import { homeImgBase } from '@/global/assets/images/imgBases'
import { MsgType } from "@/pages/index/components/MessageContainer"
import { testMsg } from "@/pages/index/initData"

import './index.scss'

function HotActivities() {
  const activityList: activityType[] = swiperActivities //~pending: 请求数据
  return (
    <Swiper className='swiper' indicatorDots={true} indicatorColor='#DFCACA' indicatorActiveColor='#0184B2' autoplay={true} interval={3000} circular={true} >
      {activityList.map((value, index) => (
        <SwiperItem key={`home-hotact-swiper${index}`} className='swiper-item'>
          <Image src={value.imgHref} className='img' />
          <Image src={`${homeImgBase}/actiMengBan.png`} className='mengban' />
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


export default function Index() {
  useLoad(() => {
    console.log('Page loaded.')
  })
  const dataList: MsgType[] = testMsg
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
        <Head type={'热门活动'} applyon='index' />
        <HotActivities />
      </View>
      <View className='my-messages'>
        <Head type={'我的消息'} applyon='index' />
        <MessageContainer dataList={dataList} />
      </View>
    </View>
  )
}
