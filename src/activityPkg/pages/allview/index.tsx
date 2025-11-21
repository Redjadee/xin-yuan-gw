import { View } from '@tarojs/components'
import ScrollFilter from '@/global/components/ScrollFilter'
import ActiItem from '@/activityPkg/components/ActiItem'
import VoidHint from '@/global/components/VoidHint'
import SearchTab from '@/global/components/SearchTab'
import { useEffect, useState } from 'react'
import { useLoad } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import type { actiType } from '@/global/utils/api/activitycenter/activity'
import { list } from '@/global/utils/api/activitycenter/activity'
import { showMsg } from '@/global/utils/common'

import './index.scss'
import AdminButton from '@/adminPkg/components/AdminButton'

export default function Allview() {
  const [ type, setType ] = useState<'1' | '0' | '' | '2'>('') // 0-全部活动 1-我的活动 2-管理端
  useLoad((options) => {
    setType(options.type)
    if(options.type === '2') Taro.setNavigationBarTitle({ title: '活动设置' })
  })
  //活动查询 Hook
  const [ status, setStatus ] = useState<0 | 1 | 2 | 3 | 4>(type === '2' ? 0 : 1)
  const [ actiType, setActiType ] = useState<0 | 1 | 2 | 3>()
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
        if (res?.data) {
          setActis(res.data.activities)
        } else {
          if(res) showMsg(res.msg)
        }
      }
    }
    if(type !== '') getList()

    return () => controller.abort()
  }, [type, status, inputVal, actiType])

  // Update status when type changes from empty to actual value
  useEffect(() => {
    if(type !== '' && type !== '2' && status === 0) {
      setStatus(1)
    } else if(type === '2' && status === 1) {
      setStatus(0)
    }
  }, [type])

  const getFilterIdx = (idx: number) => {
    switch (idx) {
      case 0: return type === '0' ? setActiType(2) : setStatus(type === '1' ? 1 : 2)
      case 1: return type === '0' ? setActiType(undefined) : setStatus(type === '1' ? 2 : 0)
      case 2: return type === '0' ? setActiType(3) : setStatus(3)
      default: showMsg('获取活动列表失败，请重试'); break;
    }
  }

  const toNewActivi = () => Taro.navigateTo({ url: '/adminPkg/pages/newActivi/index' })

  return (
    <View className='allview'>
      <SearchTab className='search' setIsInputing={setIsInputing} getInputVal={getInputVal} />
      <ScrollFilter type={type === '0' ? 'all' : type === '1' ? 'my' : 'admin'} getFilterIdx={getFilterIdx} className={isInputing && inputVal ? 'scroll-view-hide' : '' } />
      <View className='container'>
        {actis?.length === 0 ?
        <VoidHint type={type === '0' ? '活动列表' : type === '1' ? '我的活动' : '活动管理' } />  :
        actis && actis.map((value, index) => <ActiItem {...value} className={ index !== actis.length - 1? 'acti-item-border' : ''} key={`acti-item-${index}`} isAdmin={type === '2'} />)
      }
      </View>
      { type === '2' && <View className='new-acti-box'> 
        <AdminButton label='新增活动' onClick={toNewActivi} />
      </View>}
    </View>
  )
}