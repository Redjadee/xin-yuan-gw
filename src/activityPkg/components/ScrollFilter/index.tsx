import { ScrollView, View, Text } from "@tarojs/components"
import { useMemo, useState } from "react"

import './index.scss'

interface propsType {
  type: 'all' | 'my'
  getFilterIdx: (idx: number) => void
}

export default function ScrollFilter({ type, getFilterIdx }: propsType) {
  const allFilter = ['直播活动', '全部活动', '线下活动']
  const MyFilter = ['未开始', '进行中', '已结束']
  const filter = useMemo(() => {
    return type === 'all' ? allFilter : MyFilter
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
  function filterStyle(currentIndex: number) {
    return currentIndex === selected ? 'filter filter-selected' : 'filter'
  }

  return (
    <ScrollView scroll-x enable-flex className='scroll-tab'>
      <View className={['filter-box'].join(' ')}>
        {filter.map((value, index) => (
          <Text
          className={filterStyle(index)}
          onClick={() => switchFilter(index)}
          key={`alumnus-scroll-${index}`}>{value}</Text>
        ))}
      </View>
    </ScrollView>
  )
}

