import { View, Text, ScrollView, Image } from '@tarojs/components'
import { useLoad, useDidShow } from '@tarojs/taro'
import { useMemo, useState, useRef, useEffect } from 'react'
import AlumnusItem from './components/AlumnusItem'
import PopWindow from './components/PopWindow'
import VoidHint from '@/global/components/VoidHint'
import SearchTab from '@/global/components/SearchTab'
import { setStatusType, recallType } from './components/AlumnusItem'
import { useDispatch } from 'react-redux'
import { switchVisible } from '@/store/tabBarSlice'
import Taro from '@tarojs/taro'
import { showMsg } from '@/global/utils/common'

import { getjobcategories } from '@/global/utils/api/usercenter/user'
import type { jobCategoryType } from '@/global/utils/api/usercenter/user'
import { potentialList, occupation } from '@/global/utils/api/usercenter/friend'
import { orgList } from '@/global/utils/api/activitycenter/org'
import type { alumnusSayhiType, filterType } from '@/global/utils/api/usercenter/friend'
import type { orginSayhiType, orginFilterType } from '@/global/utils/api/activitycenter/org'

import { myImgBase } from '@/global/assets/images/imgBases'
import './index.scss'

const alumnusFilter = ['推荐', '全部', '同城', '同行', '职业', '同院', '同级']
const organizationFilter = ['推荐', '全部', '专业', '地方', '海外', '行业', '兴趣爱好']


interface CareerPathItem {
  name: string
  code: number
  subLevelModelList?: jobCategoryType[]
}

function Career ({ refresh, openPop }: { refresh: () => void, openPop: () => void }) {
  const [ career, setCareer ] = useState<jobCategoryType[]>([])
  const [ currentLevel, setCurrentLevel ] = useState(0)
  const [ selectedPath, setSelectedPath ] = useState<CareerPathItem[]>([])
  const [ careerUsers, setCareerUsers ] = useState<alumnusSayhiType[]>()
  const [ loading, setLoading ] = useState(false)
  const [ containerWidth, setContainerWidth ] = useState(375)
  const lastClickTimeRef = useRef(0)
  const containerRef = useRef<any>(null)
  const THROTTLE_DURATION = 500 // 500ms节流

  useEffect(() => {
    const getCareers = async () => {
      const res = await getjobcategories()
      if(res?.data) {
        setCareer(res.data.categories)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getCareers()
  }, [])

  useEffect(() => {
    if(containerRef.current) {
      const query = Taro.createSelectorQuery()
      query.select('.career-container').boundingClientRect()
      query.exec((res) => {
        if(res && res[0]) {
          setContainerWidth(res[0].width)
        }
      })
    }
  }, [])

  const handleLevelClick = async (item: jobCategoryType, level: number) => {
    const now = Date.now()
    if (now - lastClickTimeRef.current < THROTTLE_DURATION) {
      return
    }
    lastClickTimeRef.current = now

    const newPathItem: CareerPathItem = {
      name: item.name,
      code: item.code,
      subLevelModelList: item.subLevelModelList
    }

    if (level === 2) {
      // 点击第3层，使用 occupation 接口获取校友列表
      setLoading(true)
      const res = await occupation(item.name)
      if(res?.data) {
        setCareerUsers(res.data.users)
        setSelectedPath([...selectedPath, newPathItem])
        setCurrentLevel(3)
      } else {
        if(res) showMsg(res.msg)
      }
      setLoading(false)
    } else {
      // 进入下一层
      setSelectedPath([...selectedPath, newPathItem])
      setCurrentLevel(level + 1)
    }
  }

  const handleBreadcrumbClick = (breadcrumbIndex: number) => {
    // 面包屑索引: 0=校友, 1=第1层, 2=第2层, 3=第3层
    // 对应层级: 0, 1, 2, 3
    const newLevel = breadcrumbIndex
    setCurrentLevel(newLevel)
    setSelectedPath(selectedPath.slice(0, newLevel))
    if (newLevel < 3) {
      setCareerUsers(undefined)
    }
  }

  const getCurrentLevelData = (): jobCategoryType[] => {
    if (currentLevel === 0) return career
    if (currentLevel === 1) return selectedPath[0]?.subLevelModelList as any || []
    if (currentLevel === 2) return selectedPath[1]?.subLevelModelList as any || []
    return []
  }

  return (
    <View className='career-container' ref={containerRef}>
      {/* 面包屑导航 */}
      <View className='career-breadcrumb'>
        {/* 固定第一级：校友 */}
        <View className='breadcrumb-item'>
          <Text
            className={currentLevel === 0 ? 'current' : ''}
            onClick={() => handleBreadcrumbClick(0)}
          >
            校友
          </Text>
          {selectedPath.length > 0 && <Text className='separator'>{'>'}</Text>}
        </View>
        {/* 动态层级：第1层、第2层、第3层 */}
        {selectedPath.map((item, index) => (
          <View key={item.code} className='breadcrumb-item'>
            <Text
              className={currentLevel === index + 1 ? 'current' : ''}
              onClick={() => handleBreadcrumbClick(index + 1)}
            >
              {item.name}
            </Text>
            {index < selectedPath.length - 1 && <Text className='separator'>{'>'}</Text>}
          </View>
        ))}
      </View>

      {/* 层级内容 */}
      {currentLevel < 3 ? (
        <View className='career-levels' style={{ transform: `translateX(-${currentLevel * containerWidth}px)` }}>
          {[0, 1, 2].map((level) => (
            <View key={level} className='career-level'>
              {getCurrentLevelData().map(item => (
                <View
                  className='career-item'
                  key={`level-${level}-${item.code}`}
                  onClick={() => handleLevelClick(item, level)}
                >
                  <Text>{item.name}</Text>
                  <Image src={`${myImgBase}/itemArrow.png`} className='arrow' />
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : (
        // 第4层：显示校友列表
        <View className='career-users'>
          {loading ? (
            <View className='loading'>加载中...</View>
          ) : careerUsers && careerUsers.length !== 0 ? (
            careerUsers.map((value, index) => (
              <AlumnusItem
                key={`career-user-${index}`}
                type='校友'
                value={value}
                openPop={openPop}
                refresh={refresh}
              />
            ))
          ) : (
            <VoidHint type='校友组织列表' />
          )}
        </View>
      )}
    </View>
  )
}

export default function Alumnus () {
  //head Hook
  const [ label, setLabel ] = useState<'校友' | '组织'>('校友')
  useLoad(options => setLabel(options.label ? options.label : '校友'))
  const blockStyle = useMemo(() => label === '校友' ? 'block' : 'block block-switch', [label])
  //body Hook
  const bodyLabels = useMemo(() => label === '校友' ? alumnusFilter : organizationFilter, [label])
  const [ filter, setFilter ] = useState(0)
  //list Hook
  const [ alumnuses, setAlumnuses] = useState<alumnusSayhiType[]>()
  const [ alumFilter, setAlumFilter ] = useState<filterType>('recommend')
  const [ organizations, setOrganizations ] = useState<orginSayhiType[]>()
  const [ organFilter, setOrganFilter ] = useState<orginFilterType>('recommend')
  const [ refresh, setRefresh ] = useState(false) //关注、取消关注操作 刷新 重新获取list
  const handleRefresh = () => setRefresh(!refresh)
  useDidShow(() => handleRefresh())
  //popWindow Hook
  const [ pop, setPop ] = useState(false)
  const setStatusRef = useRef<setStatusType | null>(null)
  const recallRef = useRef<recallType | null>(null)
  const dispatch = useDispatch()
  //search Hook
  const [ inputVal, setInputVal ] = useState('')
  const getInputVal = (inputVal: string) => setInputVal(inputVal)
  const [ isInputing, setIsInputing ] = useState(false)
  
  
  //弹窗控制
  /**
   * 控制弹窗打开
   * @param setStatus 目前Item的关注状态的set函数
   */
  const openPop = (setStatus?: setStatusType, recall?: () => Promise<void>) => {
    if(setStatus) {
      setStatusRef.current = setStatus
    }
    if(recall) {
      recallRef.current = recall
    }
    setPop(true)
    dispatch(switchVisible())
  }
  /**
   * 控制弹窗关闭
   * @param type true：确认关闭；false：取消关闭
   */
  const closePop = async (type: boolean) => {
    if(setStatusRef) {
      if (type === true) {
        if(recallRef.current) recallRef.current()
        setStatusRef.current?.(false)
      } else {
        setStatusRef.current?.(true)
      }
      setStatusRef.current = null
      recallRef.current = null
    } else {
      Taro.navigateTo({ url: '/loginPkg/pages/register/index?type=1' })
    }
    setPop(false)
    dispatch(switchVisible())
  }

  //head
  const headLabels: ['校友', '组织'] = ['校友', '组织']
  
  /**
   * 头部开关滑动的实现
   * @param nowLabel 目前active的标签
   */
  function switchLabel(nowLabel: '校友' | '组织') {
    if(nowLabel === label){}
    else {
      setLabel(nowLabel)
      //恢复默认设置
      setFilter(0) 
      setInputVal('')
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
        const res = await potentialList(alumFilter, controller.signal, inputVal)
        if(res?.data) {
          setAlumnuses(res.data.users)
        } else {
          if(res) showMsg(res.msg)
        }               
      }
      getAlum()        
    } else {
      const getOrg = async () => {
        const res = await orgList(controller.signal, inputVal, organFilter)
        if(res?.data) {
          setOrganizations(res.data.organizations)
        } else {
          if(res) showMsg(res.msg)
        }
      }
      getOrg()
    }

    return () => controller.abort()
  }, [filter, label, refresh, inputVal])

  useMemo(() => {
    switch(filter) {
    case 0: return label === '校友' ? setAlumFilter('recommend') : setOrganFilter('recommend')
    case 1: return label === '校友' ? setAlumFilter('all') : setOrganFilter('all')
    case 2: return label === '校友' ? setAlumFilter('location') : setOrganFilter('major')
    case 3: return label === '校友' ? setAlumFilter('industry') : setOrganFilter('location')
    case 4: return label === '校友' ? setAlumFilter('career') : setOrganFilter('overseas')
    case 5: return label === '校友' ? setAlumFilter('college') : setOrganFilter('industry')
    case 6: return label === '校友' ? setAlumFilter('grade') : setOrganFilter('hobby')
  }
  }, [filter, label])

  const contents = useMemo(() => {
    if (label === '校友') {
      if(alumFilter !== 'career') {
        
        if (alumnuses && alumnuses.length !== 0) {
          return alumnuses.map((value, index) => (
            <AlumnusItem key={`alumnus-item-${index}`} type='校友' value={value} openPop={openPop} refresh={handleRefresh} />
          ))
        } else {
          return <VoidHint type='校友组织列表' />
        }

      } else {
        return <Career refresh={handleRefresh} openPop={openPop} />
      }
    } else {
      if (organizations && organizations.length !== 0) {
        return organizations.map((value, index) => (
          <AlumnusItem key={`alumnus-item-o-${index}`} type='组织' value={value} openPop={openPop} refresh={handleRefresh} />
        ))
      } else {
        return <VoidHint type='校友组织列表' />
      }
    }
  }, [label, alumnuses, organizations, openPop, handleRefresh, alumFilter])

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
          <SearchTab type={label} getInputVal={getInputVal} setIsInputing={setIsInputing} />
      </View>
      <View className='body'>
        {!isInputing && !inputVal && <ScrollView scroll-x enable-flex className='scroll-tab'>
          <View className={['filter-box', label !== '校友' && 'box2'].join(' ')}>
            {bodyLabels.map((value, index) => (
            <Text
            className={filterStyle(index)}
            onClick={() => switchFilter(index)}
            key={`alumnus-scroll-${index}`}>{value}</Text>
            ))}
          </View>
        </ScrollView>}
        <View className='alumnus-box'>
          {contents}
        </View>
      </View>
    </View>
  )
}
