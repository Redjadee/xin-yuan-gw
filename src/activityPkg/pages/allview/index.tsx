import { View } from '@tarojs/components'
import ScrollFilter from '@/global/components/ScrollFilter'
import ActiItem from '@/activityPkg/components/ActiItem'
import VoidHint from '@/global/components/VoidHint'
import SearchTab from '@/global/components/SearchTab'
import { useEffect, useMemo, useState } from 'react'
import { useLoad } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import type { actiType } from '@/global/utils/api/activitycenter/activity'
import { list } from '@/global/utils/api/activitycenter/activity'
import { showMsg } from '@/global/utils/common'
import { getuseractivities } from '@/global/utils/api/usercenter/user'
import { orgActivities } from '@/global/utils/api/activitycenter/org'

import './index.scss'
import AdminButton from '@/adminPkg/components/AdminButton'

/**
 * 活动列表页面
 *
 * URL 参数说明：
 * @param type - 活动列表类型
 *   - '0': 全部活动
 *   - '1': 我的活动（我参与的）
 *   - '2': 管理端活动列表
 *   - '3': 他人的参与活动
 *   - '4': 组织的活动
 * @param id - 用户ID 或 组织ID（type 为 '3' 或 '4' 时需要）
 */
export default function Allview() {
  const [ type, setType ] = useState<'1' | '0' | '' | '2' | '3' | '4'>('') // 0-全部活动 1-我的活动 2-管理端 3-他人的参与活动 4-组织的活动
  const [ id, setId ] = useState('')
  useLoad((options) => {
    setType(options.type)
    if(options.type === '2') Taro.setNavigationBarTitle({ title: '活动设置' })
    if(options.type === '3' || options.type === '4') setId(options.id)
    if(options.type === '4') Taro.setNavigationBarTitle({ title: '相关活动' })
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

    const getOthersList = async () => {
      const res = type === '3' ? await getuseractivities(controller.signal, id) : await orgActivities(controller.signal, id)
      if(res?.data) {
        setActis(res.data.activities)
      } else {
        if(res) showMsg(res.msg)
      }
    }

    if(type !== '') {
      if(type === '3' || type === '4' || id !== '') {
        getOthersList()
      } else getList()
    }

    return () => controller.abort()
  }, [type, status, inputVal, actiType, id])

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

  const AdminHeight = useMemo(() => ({height: 93}), [type])

  const voidHintType = useMemo(() => {
    switch(type) {
      case '': return '他人加入的组织'
      case '0': return '活动列表'
      case '1': return '我的活动'
      case '2': return '活动管理'
      case '3':
      case '4': return '他人加入的组织'
    }
  }, [type])
  return (
    <View className='allview'>
      <SearchTab className='search' setIsInputing={setIsInputing} getInputVal={getInputVal} />
      {(type !== '3' && type !== '4') && <ScrollFilter type={type === '0' ? 'all' : type === '1' ? 'my' : 'admin'} getFilterIdx={getFilterIdx} className={isInputing && inputVal ? 'scroll-view-hide' : '' } />}
      <View className='container'>
        {actis?.length === 0 ?
        <VoidHint type={voidHintType} />  :
        actis && actis.map((value, index) => <ActiItem {...value} className={ index !== actis.length - 1? 'acti-item-border' : ''} key={`acti-item-${index}`} isAdmin={type === '2'} />)
      }
      </View>
      { type === '2' && <View style={AdminHeight}></View>}
      { type === '2' && <View className='new-acti-box'> 
        <AdminButton label='新增活动' onClick={toNewActivi} />
      </View>}
    </View>
  )
}