import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import React, { useCallback, useState } from 'react'
import type { alumnusSayhiType } from '@/global/utils/api/usercenter/friend'
import type { orginSayhiType } from '@/global/utils/api/activitycenter/org'
import { alumnusImgBase, profile as profileHref } from '@/global/assets/images/imgBases'
import { friendUnfollow, greetingSend } from '@/global/utils/api/usercenter/friend'
import { orgExit, orgJoin } from '@/global/utils/api/activitycenter/org'
import { showMsg } from '@/global/utils/common'

import './index.scss'

export type setStatusType = React.Dispatch<React.SetStateAction<boolean>>
export type recallType = () => Promise<void>

type propsType = {
  value: alumnusSayhiType | orginSayhiType
  openPop: (setStatus?: setStatusType, recall?: () => Promise<void>) => void
  type: '校友' | '组织'
  refresh: () => void
}

export default function AlumnusItem({ value, openPop, type, refresh }: propsType) {
  const [status, setStatus] = useState<boolean>(value.isfollow)

  const sayHi = async () => {
    if(type === '校友') {
      const res = await greetingSend(value.id)
      if(res?.data) {
        showMsg(res.data.message)
        setStatus(!status)
        refresh()
      } else {
        if(res) showMsg(res.msg)
      }
    } else {
      const res = await orgJoin(value.id, '')
      if(res?.data) {
        showMsg(res.data.message)
        refresh()
      } else {
        if(res) showMsg(res.msg)
      }
    }
  }
  const recall = async () => {
    if(type === '校友') {
      const res = await friendUnfollow(value.id)
      if(res?.data) {
        showMsg(res.data.message)
        refresh()
      } else {
        if(res) showMsg(res.msg)
      }
    } else {
      const res = await orgExit(value.id)
      if(res?.data) {
        showMsg(res.data.message)
        refresh()
      } else {
        if(res) showMsg(res.msg)
      }
    }
  }

  const handleOpen = (e) => {
    e.stopPropagation() // 阻止事件冒泡，避免触发父级的路由事件
    if (status === true) {
      openPop(setStatus, recall)
    } else {
      sayHi()
    }
  }
  
  const toInfor = useCallback(() => {
    const sendType = type === '校友' ? '个人' : '组织'
    Taro.navigateTo({ url: `/msgPkg/pages/infor/index?type=${sendType}&id=${value.id}&status=${status}` })
  }, [type, status])

  const profile = value.avatar ? value.avatar : profileHref
  return (
    <View className='alumnus-item' onClick={toInfor}>
      <Image src={profile} className='profile' />
      <View className='border-box'>
        <View className='middle-box'>
          <Text className={`name ${type === '组织' ? 'org-name' : ''}`}>{value.name}</Text>
          <Text className='description'>{value.bio}</Text>
        </View>
        <View onClick={handleOpen}
          className={status === true ? 'button selected' : 'button'}>
          {type === '校友' ? 
          <Text className='text'>{status === true ? '已关注' : '打招呼'}</Text> :
          status === true ? <Text className='text' >已加入</Text>: <View className='add-box'><Image src={`${alumnusImgBase}/add.png`} className='add' /><Text className='text'>加入</Text></View>
          }
        </View>
      </View>
    </View>
  )
}