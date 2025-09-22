import { View, Text } from '@tarojs/components'
import ScrollFilter from '@/activityPkg/components/ScrollFilter'
import SearchTab from '@/global/components/SearchTab'
import ActiItem from '@/activityPkg/components/ActiItem'
import { actiItems } from './initData'
import { useState } from 'react'
import { useLoad } from '@tarojs/taro'

import './index.scss'

export default function Allview() {
  const [type, setType] = useState('')
  useLoad((options) => {
    setType(options.type)
  })
  
  return (
    <View className='allview'>
      <SearchTab className='search' />
      <ScrollFilter type={type === '0' ? 'all' : 'my'} />
      <View>
        {actiItems.map((value, index) => <ActiItem {...value} className={ index !== actiItems.length - 1? 'acti-item-border' : ''} key={`acti-item-${index}`} />)}
      </View>
    </View>
  )
}