import { View, Text, Input, Image, ScrollView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useMemo, useState, useRef, useEffect } from 'react'
import AlumnusItem from './components/AlumnusItem'
import PopWindow from './components/PopWindow'
import VoidHint from '@/global/components/VoidHint'
import { setStatusType } from './components/AlumnusItem'
import { useDispatch } from 'react-redux'
import { switchVisible } from '@/store/tabBarSlice'
import Taro from '@tarojs/taro'
import { showMsg } from '@/global/utils/common'

import { potentialList } from '@/global/utils/api/usercenter/friend'
import { orgList } from '@/global/utils/api/activitycenter/org'
import type { alumnusSayhiType, filterType } from '@/global/utils/api/usercenter/friend'
import type { orginSayhiType } from '@/global/utils/api/activitycenter/org'

import { alumnusImgBase } from '@/global/assets/images/imgBases'
import './index.scss'

const alumnusFilter = ['推荐', '全部', '同城', '同行', '同院', '同级']
const organizationFilter = ['推荐', '全部', '专业', '地方', '海外', '行业', '兴趣爱好']

export default function Alumnus () {
  useLoad(() => {
    console.log('Page loaded.')
  })
  //head Hook
  const [ label, setLabel ] = useState('校友')
  const [ blockStyle, setBlockStyle ] = useState('block')
  //body Hook
  const [ bodyLabels, setBodyLabels] = useState(alumnusFilter)
  const [ filter, setFilter ] = useState(0)
  //list Hook
  const [ alumnuses, setAlumnuses] = useState<alumnusSayhiType[]>()
  const [ alumFilter, setAlumFilter ] = useState<filterType>('all')
  const [ organizations, setOrganizations ] = useState<orginSayhiType[]>()
  const [ organFilter, setOrganFilter ] = useState()
  //popWindow Hook
  const [ pop, setPop ] = useState(false)
  const setStatusRef = useRef<setStatusType | null>(null)
  const dispatch = useDispatch()
  //弹窗控制
  /**
   * 控制弹窗打开
   * @param setStatus 目前Item的关注状态的set函数
   */
  const openPop = (setStatus?: setStatusType) => {
    if(setStatus) {
      setStatusRef.current = setStatus
    }
    setPop(true)
    dispatch(switchVisible())
  }
  /**
   * 控制弹窗关闭
   * @param type true：确认关闭；false：取消关闭
   */
  const closePop = (type: boolean) => {
    if(setStatusRef) {
      type === true ? setStatusRef.current?.(false) : setStatusRef.current?.(true)
      setStatusRef.current = null
    } else {
      Taro.navigateTo({ url: '/loginPkg/pages/register/index?type=1' })
    }
    setPop(false)
    dispatch(switchVisible())
  }

  //head
  const headLabels = ['校友', '组织']
  
  /**
   * 头部开关滑动的实现
   * @param nowLabel 目前active的标签
   */
  function switchLabel(nowLabel: string) {
    if(nowLabel === label){}
    else {
      setLabel(nowLabel)
      setBlockStyle(nowLabel === '组织' ? 'block block-switch' :  'block')   
      setBodyLabels(nowLabel === '组织' ? organizationFilter : alumnusFilter)
      setFilter(0) //恢复默认设置
    }
  }

  //body 
  /**
   * 筛选器的更新
   * @param nowFilter 目前active的筛选器
   */
  function switchFilter(nowFilter: number) {
    if(nowFilter === filter){}
    else {
      setFilter(nowFilter)
    }
  }
  /**
   * 筛选器被选中状态的更新
   * @param currentFilter 当前筛选器
   * @returns 对应筛选器状态的样式
   */
  function filterStyle(currentFilter: number) {
    return currentFilter === filter ? 'filter filter-selected' : 'filter'
  }

  useEffect(() => {
    const controller = new AbortController()

    if( label === '校友' ) {
      const getAlum = async () => {
        const res = await potentialList(alumFilter, controller.signal)
        if(res?.data) {
          setAlumnuses(res.data.users)
        } else {
          if(res) showMsg(res.msg)
        }               
      }
      getAlum()
    } else {
      const getOrg = async () => {
        const res = await orgList(controller.signal)
        if(res?.data) {
          setOrganizations(res.data.organizations)
        } else {
          if(res) showMsg(res.msg)
        }
      }
      getOrg()
    }

    return () => controller.abort()
  }, [filter, label])

  useMemo(() => {
    switch(filter) {
    case 0: return label === '校友' ? setAlumFilter('recommend') : setOrganFilter()
    case 1: return label === '校友' ? setAlumFilter('all') : setOrganFilter()
    case 2: return label === '校友' ? setAlumFilter('location') : setOrganFilter()
    case 3: return label === '校友' ? setAlumFilter('industry') : setOrganFilter()
    case 4: return label === '校友' ? setAlumFilter('college') : setOrganFilter()
    case 5: return label === '校友' ? {} : setOrganFilter()
    case 6: return label === '校友' ? {} : setOrganFilter()
  }
  }, [filter, label])
  
  return (
    <View className='alumnus'>
      {pop && <PopWindow closePop={closePop} type='关注用户' />}
      <View className='head'>
          <View className='switch'>
            <View className={blockStyle}></View>
            {headLabels.map((value, index) => (
              <Text className={['label', label === value ? 'label-selected': ''].join(' ')} onClick={() => switchLabel(value)} key={`alumnus-switch-${index}`}>{value}</Text>
            ))}
          </View>
          <View className='search-bar'>
            <Image src={`${alumnusImgBase}/search.png`} className='icon' />
            <Input type='text' placeholder={`搜索你的${label}`} placeholderTextColor='#CCC8C8' className='input' />
          </View>
      </View>
      <View className='body'>
        <ScrollView scroll-x enable-flex className='scroll-tab'>
          <View className={['filter-box', label !== '校友' && 'box2'].join(' ')}>
            {bodyLabels.map((value, index) => (
            <Text
            className={filterStyle(index)}
            onClick={() => switchFilter(index)}
            key={`alumnus-scroll-${index}`}>{value}</Text>
            ))}
          </View>
        </ScrollView>
        <View className='alumnus-box'>
          { label === '校友' ? 
            (alumnuses && alumnuses.length !== 0 ? alumnuses.map((value, index) => (
              <AlumnusItem key={`alumnus-item-${index}`} type='校友' value={value} openPop={openPop} />
            )) : <VoidHint type='校友组织列表' />) :
            (organizations && organizations.length !== 0 ? organizations.map((value, index) => (
              <AlumnusItem key={`alumnus-item-o-${index}`} type='组织' value={value} openPop={openPop} />
            )) : <VoidHint type='校友组织列表' />) 
          }
        </View>
      </View>
    </View>
  )
}
