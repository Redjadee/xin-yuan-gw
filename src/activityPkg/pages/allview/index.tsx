import { View } from '@tarojs/components'
import ScrollFilter from '@/activityPkg/components/ScrollFilter'
import ActiItem from '@/activityPkg/components/ActiItem'
import VoidHint from '@/global/components/VoidHint'
import SearchTab from '@/global/components/SearchTab'
import { useEffect, useState } from 'react'
import { useLoad } from '@tarojs/taro'

import { actiType, list } from '@/global/utils/api/activitycenter/activity'
import { showMsg } from '@/global/utils/common'

import './index.scss'

export default function Allview() {
  const [ type, setType ] = useState<'1' | '0' | ''>('') // 0-全部活动 1-我的活动
  useLoad((options) => {
    setType(options.type)
  })
  //活动查询 Hook
  const [ status, setStatus ] = useState<'0' | '1' | '2' | '3' | '4'>('2')
  const [ actiType, setActiType ] = useState<'0' | '1' | '2' | '3'>()
  //活动 Hook
  const [ actis, setActis ] = useState<actiType[]>()
  //搜索 Hook
  const [ inputVal, setInputVal ] = useState('')
  const getInputVal = (inputVal: string) => setInputVal(inputVal)
  const [ isInputing, setIsInputing ] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    const getList = async () => {
      if(type !== '') {
        const res = await list(controller.signal, type, status, inputVal, actiType)
        if (res) {
          setActis(res)
        } else {
          showMsg('获取活动列表失败，请重试')
        }
      }
    }
    if(type !== '') getList()

    return () => controller.abort()
  }, [type, status, inputVal, actiType])

  const getFilterIdx = (idx: number) => {
    switch (idx) {
      case 0: return type === '0' ? setActiType('2') : setStatus('1')
      case 1: return type === '0' ? setActiType(undefined) : setStatus('2') 
      case 2: return type === '0' ? setActiType('3') : setStatus('3')
      default: showMsg('获取活动列表失败，请重试'); break;
    }
  }

  return (
    <View className='allview'>
      <SearchTab className='search' setIsInputing={setIsInputing} getInputVal={getInputVal} />
      { !isInputing && !inputVal && <ScrollFilter type={type === '0' ? 'all' : 'my'} getFilterIdx={getFilterIdx} />}
      <View className='container'>
        {actis?.length === 0 ?
        <VoidHint type={type === '0' ? '活动列表' : '我的活动' } />  :
        actis && actis.map((value, index) => <ActiItem {...value} className={ index !== actis.length - 1? 'acti-item-border' : ''} key={`acti-item-${index}`} />)
      }
      </View>
    </View>
  )
}