import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectLogged } from '@/store/authSlice'

import { alumnusImgBase, profile as profileHref } from '@/global/assets/images/imgBases'

import './index.scss'

//TODO 写成 构造函数 or class类？
export interface itemType {
  profileHref: string
  name: string
  description: string

  status: boolean //关注/加入状态，默认false
  url: string //个人主页链接

  type: '校友' | '组织'
  alumnus?: {
    city?: string //城市
    domain?: string //行业
    department?: '计科' | '软工' | '网安' | '人工智能' //院系
    grade?: string //年级
  }

  //其实想改成枚举量，但由于不知道分类细节，暂时搁置
  organization?: {
    professional?: boolean //专业
    centainArea?: boolean //地方
    oversea?: boolean //海外
    industry?: boolean //行业
    habit?: boolean //兴趣爱好
  }
}

export type setStatusType = React.Dispatch<React.SetStateAction<boolean>>

type propsType = {
  value: itemType
  openPop: (setStatus?: setStatusType) => void
}

export default function AlumnusItem({ value, openPop }: propsType) {
  const logged = useSelector(selectLogged)
  const [status, setStatus] = useState<boolean>(value.status)

  const handleOpen = () => {
    if(logged) {
      if (status === true) {
        openPop(setStatus)
      } else {
        setStatus(!status)
      }
    } else {
      openPop()
    }
  }
  
  const profile = value.profileHref ? value.profileHref : profileHref
  return (
    <View className='alumnus-item'>
      <Image src={profile} className='profile' />
      <View className='border-box'>
        <View className='middle-box'>
          <Text className='name'>{value.name}</Text>
          <Text className='description'>{value.description}</Text>
        </View>
        <View onClick={handleOpen}
          className={status === true ? 'button selected' : 'button'}>
          {value.type === '校友' ? 
          <Text className='text'>{status === true ? '已关注' : '打招呼'}</Text> :
          status === true ? <Text className='text' >已加入</Text>: <View className='add-box'><Image src={`${alumnusImgBase}/add.png`} className='add' /><Text className='text'>加入</Text></View>
          }
        </View>
      </View>
    </View>
  )
}