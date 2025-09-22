import { ScrollView, View, Text } from "@tarojs/components"
import { useMemo, useState } from "react"

import './index.scss'

interface propsType {
  type: 'all' | 'my'
}

export default function ScrollFilter({ type }: propsType) {
  const allFilter = ['付费活动', '全部活动', '免费活动']
  const MyFilter = ['未开始', '进行中', '已结束']
  const filter = useMemo(() => {
    return type === 'all' ? allFilter : MyFilter
  }, [type])
  
  const [ selected, setSelected ] = useState(1)
  function switchFilter(nowIndex: number) {
    if(nowIndex === selected){}
    else {
      setSelected(nowIndex)
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

