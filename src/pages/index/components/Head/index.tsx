import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { homeImgBase } from '@/global/assets/images/imgBases'

import './index.scss'

interface HeadType {
  type: '热门活动' | '我的消息' | '活动介绍' | '活动信息'
  applyon: 'index' | 'acti'

  className?: string
}

export default function Head({ type, applyon, className }: HeadType) {
  
  //router
  const authStatus = useSelector((state: RootState) => state.auth.isLogged)
  const handleRouter = () => {
    type === '热门活动' ?
    Taro.navigateTo({ url: '/activityPkg/pages/allview/index?type=0' }) :
    authStatus ? Taro.navigateTo({ url: '' }) : Taro.reLaunch({ url: '/loginPkg/pages/login/index' })
  }
  if (applyon === 'index') 
  return (
    <View className='head-components'>
      <Text className='title'>{type}</Text>
      <View className='all-button' onClick={handleRouter}>
        <Text>全部</Text>
        <Image src={`${homeImgBase}/headArrow.png`} className='arrow' />
      </View>
    </View>
  )
  else
  return (
    <View className={`head-components ${className}`}>
      <Text className='title'>{type}</Text>
    </View>
  )
}