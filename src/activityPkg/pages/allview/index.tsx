import { View } from '@tarojs/components'
import ScrollFilter from '@/activityPkg/components/ScrollFilter'
import SearchTab from '@/global/components/SearchTab'
import ActiItem from '@/activityPkg/components/ActiItem'
import { useEffect, useState } from 'react'
import { useLoad } from '@tarojs/taro'

import { actiType, list } from '@/global/utils/api/activitycenter/activity'
import { showMsg } from '@/global/utils/common'

import './index.scss'

export default function Allview() {
  const [type, setType] = useState<'1' | '0' | ''>('') // 0-全部活动 1-我的活动
  useLoad((options) => {
    setType(options.type)
  })
  
  const [ actis, setActis ] = useState<actiType[]>()
  const [ showActis, setShowactis ] = useState<actiType[]>()
  
  useEffect(() => {
    const controller = new AbortController()

    const getList = async () => {
      if(type !== '') {
        const res = await list(controller.signal, type)
        if (res) {
          setActis(res)
          setShowactis(res)
        }
      }
    }
    if(type !== '') getList()

    return () => controller.abort()
  }, [type])

  const getFilterIdx = (idx: number) => {
    switch (idx) { //FIXME
      case 0: setShowactis(actis?.filter(val => val.type === '2')); break;
      case 1: setShowactis(actis); break;
      case 2: setShowactis(actis?.filter(val => val.type === '3')); break;
      default: showMsg('获取活动列表失败，请重试'); break;
    }
  }

  return (
    <View className='allview'>
      <SearchTab className='search' />
      <ScrollFilter type={type === '0' ? 'all' : 'my'} getFilterIdx={getFilterIdx} />
      <View className='container'>
        {showActis && showActis.map((value, index) => <ActiItem {...value} className={ index !== showActis.length - 1? 'acti-item-border' : ''} key={`acti-item-${index}`} />)}
      </View>
    </View>
  )
}