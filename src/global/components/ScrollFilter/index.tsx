import { ScrollView, View, Text } from "@tarojs/components"
import { useCallback, useEffect, useMemo, useState } from "react"
import { list } from '@/global/utils/api/activitycenter/activity'

import './index.scss'

interface propsType {
  type: 'all' | 'my' | 'admin'
  getFilterIdx: (idx: number) => void
}

export default function ScrollFilter({ type, getFilterIdx }: propsType) {
  const allFilter = ['直播活动', '全部活动', '线下活动']
  const MyFilter = ['未开始', '进行中', '已结束']
  const adminFilter = ['进行中', '待发布', '已结束']
  const filter = useMemo(() => {
    switch(type) {
      case 'admin': return adminFilter
      case 'all': return allFilter
      case 'my': return MyFilter
    }
  }, [type])
  
  const [ selected, setSelected ] = useState(1)
  //onClick event
  function switchFilter(nowIndex: number) {
    if(nowIndex === selected){}
    else {
      setSelected(nowIndex)
      getFilterIdx(nowIndex)
    }
  }
  const filterStyle = useCallback((currentIndex: number) => currentIndex === selected ? 'filter filter-selected' : 'filter', [selected])

  const [ adminNum, setAdminNums ] = useState([0, 0, 0])
  console.log(adminNum)
  useEffect(() => {
    const controller = new AbortController()

    const getNums = async () => {
      const number1Res = await list(controller.signal, '0', '2', '', undefined) as Array<number>
      const number2Res = await list(controller.signal, '0', '0', '', undefined) as Array<number>
      const number3Res = await list(controller.signal, '0', '3', '', undefined) as Array<number>
      if(number1Res && number2Res && number3Res) {
        console.log(number1Res, number2Res, number3Res)
        setAdminNums([number1Res.length, number2Res.length, number3Res.length])
      }
    }
    if(type === 'admin') getNums()

    return () => controller.abort()
  }, [type])

  return (
    <ScrollView scroll-x enable-flex className='scroll-tab'>
      <View className={['filter-box'].join(' ')}>
        {filter.map((value, index) => (
          type === 'admin'  ? 
          <View className="alumnus-scroll-box">
            <Text
            className={filterStyle(index)}
            onClick={() => switchFilter(index)}
            key={`alumnus-scroll-${index}`}>{value}</Text>
            <Text>{adminNum && `(${adminNum[index]})`}</Text>  
          </View> :
          <Text
          className={filterStyle(index)}
          onClick={() => switchFilter(index)}
          key={`alumnus-scroll-${index}`}>{value}</Text>
        ))}
      </View>
    </ScrollView>
  )
}

