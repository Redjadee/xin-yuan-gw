import { View, Text, Image } from '@tarojs/components'
import { profile as profileHref } from '@/global/assets/images/imgBases'
import { TextEllipsis } from '@taroify/core'
import '@taroify/core/text-ellipsis/index.css'
import Taro from '@tarojs/taro'

import './index.scss'

type propsType = {
  value: any
  type: '校友' | '组织'
}

export default function AuditItem({ value, type }: propsType) {
  const profile = value.avatar ? value.avatar : profileHref

  // 格式化描述文本，将换行符替换为空格
  const formatDescription = (text: string) => {
    return text ? text.replace(/\n/g, ' ') : '暂无描述'
  }

  const handleRouter = () => {
    if(type === '组织') Taro.navigateTo({ url: `/adminPkg/pages/newOrgan/index?id=${value.id}` })
    else Taro.navigateTo({ url: `/adminPkg/pages/auditDetail/index?id=${value.id}` })
  }

  return (
    <View className='audit-item'>
      <Image src={profile} className='profile' />
      <View className='border-box'>
        <View className='middle-box'>
          <Text className='name'>{value.name || 'Unknown'}</Text>
          <TextEllipsis className='description'>{formatDescription(value.detail || value.description || '')}</TextEllipsis>
        </View>
        <View className='button' onClick={handleRouter}>
          <Text className='text'>详情</Text>
        </View>
      </View>
    </View>
  )
}