import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import Head from './components/Head'
import MessageContainer from './components/MessageContainer'
import VoidHint from '@/global/components/VoidHint'
import { activityType } from './initData'
import { swiperActivities } from './initData'
import { homeImgBase } from '@/global/assets/images/imgBases'
import { MsgShowType } from "@/pages/index/components/MessageContainer"
import { showMsg } from '@/global/utils/common'
import { messageList } from '@/global/utils/api/usercenter/message'
import { useEffect, useState } from 'react'

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
  const [ msgs, setMsgs ] = useState<MsgShowType[]>()

  useEffect(() => {
    const controller = new AbortController()

    const getMsgs = async () => {
      const res = await messageList(controller.signal)
      if(res?.data) {
        setMsgs(res.data.messages)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getMsgs()

    return () => controller.abort()
  }, [])

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
        {msgs && msgs.length != 0 ? <MessageContainer dataList={msgs} /> : <VoidHint type='消息列表' />}
      </View>
    </View>
  )
}
