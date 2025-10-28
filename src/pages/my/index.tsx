import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import FunctionItem from './components/FunctionItem'
import { getuserinfo } from '@/global/utils/api/usercenter/user'
import type { userInforType } from '@/global/utils/api/usercenter/user'
import { showMsg } from '@/global/utils/common'
import { useEffect, useState, useMemo } from 'react'

import { myImgBase } from '@/global/assets/images/imgBases'
import './index.scss'



export default function My () {
  const [ infor, setInfor ] = useState<userInforType>()

  useEffect(() => {
    const controller = new AbortController()

    const getInfor = async () => {
      const res = await getuserinfo('0', controller.signal)
      if(res?.data) {
        setInfor(res.data.userinfo)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getInfor()

    return () => controller.abort()
  }, [])

  const profileHref = useMemo(() => 
    infor && infor.avatar !== '' ? infor.avatar : `${myImgBase}/defaultMyProfile.png`, [infor])
  const name = useMemo(() => infor ? infor.realname : '信息人', [infor])
  const brief = useMemo(() => infor && infor.bio !== '' ? infor.bio : '个人简介', [infor])

  const arrowHref = `${myImgBase}/myDetail.png`
  const headRouter = () => {
    Taro.navigateTo({
      url: '/myPkg/pages/myinfor/index',
      success: res => {
        res.eventChannel.emit('acceptUserinfor', { ...infor })
      }
    })
  }
  const functionItemList  = [
    {
      href: `${myImgBase}/item1.png`,
      label: '校友通讯录',
      url: '/myPkg/pages/contact/index?type=0'
    },
    {
      href: `${myImgBase}/item2.png`,
      label: '加入的组织',
      url: '/myPkg/pages/contact/index?type=1'
    },
    {
      href: `${myImgBase}/item3.png`,
      label: '参与活动',
      url: '/activityPkg/pages/allview/index?type=1'
    },
    {
      href: `${myImgBase}/item4.png`,
      label: '账号设置',
      url: `/myPkg/pages/setting/index`
    }
  ]

  return (
    <View className='my'>
      <View className='head'>
        <Image src={`${myImgBase}/bgimg.png`} className='head-bgimg' />
        <View className='head-wrapper' onClick={headRouter}>
          <Image src={profileHref} className='profile' />
          <View className='middle-box'>
            <Text className='name'>{name}</Text>
            <Text className='brief' >{brief}</Text>
          </View>
          <Image src={arrowHref} className='arrow'  />
        </View>
      </View>
      {functionItemList.map((value, index) => FunctionItem({...value, index}))}
    </View>
  )
}
