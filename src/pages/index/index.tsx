import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import Head from './components/Head'
import MessageContainer from './components/MessageContainer'
import VoidHint from '@/global/components/VoidHint'
import { homeImgBase } from '@/global/assets/images/imgBases'
import { MsgShowType } from "@/pages/index/components/MessageContainer"
import { showMsg } from '@/global/utils/common'
import { messageList } from '@/global/utils/api/usercenter/message'
import { actRecommend } from '@/global/utils/api/activitycenter/activity'
import type { actiType } from '@/global/utils/api/activitycenter/activity'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useDidShow } from '@tarojs/taro'

import './index.scss'

function HotActivities() {
  const [ actis, setActis ] = useState<actiType[]>([])

  useEffect(() => {
    const controller = new AbortController()

    const getList = async () => {
      const res = await actRecommend(controller.signal)
      if(res?.data) {
        setActis(res.data.activities)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getList()

    return () => controller.abort()
  }, [])

  const handleRouter = (val: actiType) => {
    Taro.navigateTo({ url: `/activityPkg/pages/detail/index?id=${val.id}` })
  }

  return (
    <Swiper className='swiper' indicatorDots={true} indicatorColor='#DFCACA' indicatorActiveColor='#0184B2' autoplay={true} interval={3000} circular={true} >
      {actis.map((value, index) => (
        <SwiperItem onClick={() => handleRouter(value)} key={`home-hotact-swiper${index}`} className='swiper-item'>
          <Image src={value.coverurl} className='img' />
          <Image src={`${homeImgBase}/actiMengBan.png`} className='mengban' />
          <View className='label-box'>
            <Text className='name'>{value.title}</Text>
            {/* <Text className='time' >{value.starttime}</Text> */}
          </View>
        </SwiperItem>
      ))}
    </Swiper>
  )
}
//


export default function Index() {
  const [ msgs, setMsgs ] = useState<MsgShowType[]>()

  useDidShow(() => {
    const controller = new AbortController()

    const getMsgs = async () => {
      const res = await messageList(controller.signal, 'fromHome')
      if(res?.data) {
        setMsgs(res.data.messages)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getMsgs()

    return () => controller.abort()
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
