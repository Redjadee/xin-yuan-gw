import { View, Text, Input, Image, ScrollView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useMemo, useState, useRef } from 'react'
import AlumnusItem from './components/AlumnusItem'
import PopWindow from './components/PopWindow'
import { setStatusType } from './components/AlumnusItem'
import { useDispatch } from 'react-redux'
import { switchVisible } from '@/store/tabBarSlice'
import Taro from '@tarojs/taro'

import { alumnusImgBase } from '@/global/assets/images/imgBases'
import { myInfor, alumnusItemList, organizationList } from './initData'
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
  const [ alumnuses, setAlumnuses] = useState(alumnusItemList)
  const [ organizations, setOrganizations ] = useState(organizationList)
  //popWindow Hook
  const [ pop, setPop ] = useState(false)
  const setStatusRef = useRef<setStatusType | null>(null)
  const dispatch = useDispatch()
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

  useMemo(() => {
    switch(filter) {
    case 0: ;break;
    case 1: { setAlumnuses(alumnusItemList); setOrganizations(organizationList) }; break;
    case 2: { setAlumnuses(alumnusItemList.filter(val => val.alumnus?.city === myInfor.alumnus?.city)); 
              setOrganizations(organizationList.filter(val => val.organization?.professional === true));
    }; break;
    case 3: { setAlumnuses(alumnusItemList.filter(val => val.alumnus?.domain === myInfor.alumnus?.domain));
              setOrganizations(organizationList.filter(val => val.organization?.centainArea === true));         
     }; break;
    case 4: { setAlumnuses(alumnusItemList.filter(val => val.alumnus?.department === myInfor.alumnus?.department));
              setOrganizations(organizationList.filter(val => val.organization?.oversea === true));
    }; break;
    case 5: { setAlumnuses(alumnusItemList.filter(val => val.alumnus?.grade === myInfor.alumnus?.grade));
              setOrganizations(organizationList.filter(val => val.organization?.industry === true));
    }; break;
    case 6: { setOrganizations(organizationList.filter(val => val.organization?.habit === true)) }; break;
  }
  }, [filter])
  
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
            alumnuses.map((value, index) => (
              <AlumnusItem key={`alumnus-item-${index}`} value={value} openPop={openPop} />
            )) :
            organizations.map((value, index) => (
              <AlumnusItem key={`alumnus-item-o-${index}`} value={value} openPop={openPop} />
            )) 
          }
        </View>
      </View>
    </View>
  )
}
