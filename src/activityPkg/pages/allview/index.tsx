import { View } from '@tarojs/components'
import ScrollFilter from '@/activityPkg/components/ScrollFilter'
import SearchTab from '@/global/components/SearchTab'
import ActiItem from '@/activityPkg/components/ActiItem'
import { useEffect, useState } from 'react'
import { useLoad } from '@tarojs/taro'

import { actiType, list } from '@/global/utils/api/activitycenter/activity'
import axios from "axios"

import './index.scss'

export default function Allview() {
  const [type, setType] = useState('')
  useLoad((options) => {
    setType(options.type)
  })
  
  const [ actis, setActis ] = useState<actiType[]>()
  const [ showActis, setShowactis ] = useState<actiType[]>()
  useEffect(() => {
    const source = axios.CancelToken.source()

    const getList = async () => {
      const res = await list()
      if (res) {
        setActis(res)
        setShowactis(res)
      }
    }
    getList()

    return () => source.cancel("请求取消")
  }, [])
  const getFilterIdx = (idx: number) => {
    switch (idx) {
      case 0: setShowactis(actis?.filter(val => val.type === '0')); break;
      case 1: setShowactis(actis); break;
      case 2: setShowactis(actis?.filter(val => val.type === '1')); break;
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