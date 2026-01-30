import { useState, useEffect, useRef } from 'react'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import VoidHint from '@/global/components/VoidHint'
import SearchTab from '@/global/components/SearchTab'
import ContactItem from '@/myPkg/components/ContactItem'
import Taro, { useLoad } from '@tarojs/taro'
import { contactList, enrollmentyears, enrollmentyearsGetAlumnus } from '@/global/utils/api/usercenter/friend'
import { orgContactList } from '@/global/utils/api/activitycenter/org'
import { showMsg } from '@/global/utils/common'
import { getuserorganizations } from '@/global/utils/api/usercenter/user'
import { myImgBase } from '@/global/assets/images/imgBases'

import './index.scss'

type AlphabetItem = {
  initial: string
  datas: {
    id: string
    name: string
    avatar: string
  }[]
}

type CategoryItem = {
  name: string
  type: 'all' | 'year'
  year?: string
}

/**
 * 通讯录页面
 *
 * URL 参数说明：
 * @param type - 通讯录类型
 *   - '0': 校友通讯录（两层结构：分类列表 → 人员列表）
 *   - '1': 组织通讯录（直接显示字母索引列表）
 *   - 其他值: 他人加入的组织（直接显示字母索引列表）
 * @param id - 组织/用户 ID（type 为 '1' 或其他时需要）
 */
export default function AlphabetList() {
  const [ type, setType ] = useState('')
  const [ id, setId ] = useState('')
  useLoad(options => {
    setType(options.type)
    if(options.id) setId(options.id)
  })

  //层级控制
  const [ currentLevel, setCurrentLevel ] = useState(0) // 0=分类列表, 1=人员列表
  const [ selectedCategory, setSelectedCategory ] = useState<CategoryItem | null>(null)
  const [ enrollmentYears, setEnrollmentYears ] = useState<string[]>([])

  //contact
  const [alpha, setAlpha] = useState<string>('');
  const [windowHeight, setWindowHeight] = useState<string>('');
  const apHeightRef = useRef<number>(16); //每个字母项的高度
  const offsetTopRef = useRef<number>(80); //字母选择器距离顶部的偏移量

  const [ list, setList ] = useState<AlphabetItem[]>([])

  useEffect(() => {
    try {
      const res = Taro.getSystemInfoSync();
      setWindowHeight(`${res.windowHeight-85}px`);
      const query = Taro.createSelectorQuery();
      query.select('.alphanet-selector').boundingClientRect();
      query.select('.selector-one').boundingClientRect();
      query.exec((res) => {
        if (res[0] && res[1]) {
          offsetTopRef.current = res[0].top; // 选择器顶部位置
          apHeightRef.current = res[1].height; // 单个字母高度
        }
      })
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  }, []);

  const handlerAlphaTap = (e: any) => {
    const { ap } = e.currentTarget.dataset;
    setAlpha(ap);
  };

  const handlerMove = (e: any) => {
    const moveY = e.touches[0].clientY;
    const rY = moveY - offsetTopRef.current;

    if (rY >= 0) {
      const index = Math.floor(rY / apHeightRef.current);
      if (index >= 0 && index < list.length) {
        const nowAp = list[index];
        nowAp && setAlpha(nowAp.initial);
      }
    }
  };

  //search
  const [ isInputing, setIsInputing ] = useState(false)
  const [ inputVal, setInputVal ] = useState('')
  const [ searchResults, setSearchResults ] = useState<AlphabetItem[]>([])
  const getInputVal = (val: string) => setInputVal(val)

  //处理分类点击
  const handleCategoryClick = async (category: CategoryItem) => {
    setSelectedCategory(category)
    await getContactList(category)
    setCurrentLevel(1)
  }

  //处理面包屑点击
  const handleBreadcrumbClick = (level: number) => {
    setCurrentLevel(level)
    if (level === 0) {
      setSelectedCategory(null)
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    const getList = async () => {
      if(type === '0') {
        const res = await enrollmentyears(controller.signal)
        if(res?.data) {
          setEnrollmentYears(res.data.enrollmentyears)
        } else {
          if(res) showMsg(res.msg)
        }
      } else if(type === '1') {
        const res = await orgContactList(controller.signal, id)
        if(res?.data) {
          setList(res.data.organizations)
        } else {
          if(res) showMsg(res.msg)
        }
      } else {
        const res = await getuserorganizations(controller.signal, id)
        if(res?.data) {
          setList(res.data.organizations)
        } else {
          if(res) showMsg(res.msg)
        }
      }
    }
    getList()

    return () => controller.abort()
  }, [type, id])

  //获取人员列表
  const getContactList = async (category: CategoryItem) => {
    const controller = new AbortController()

    if (category.type === 'all') {
      const res = await contactList(controller.signal)
      if(res?.data) {
        setList(res.data.users)
      } else {
        if(res) showMsg(res.msg)
      }
    } else if (category.year) {
      const res = await enrollmentyearsGetAlumnus(controller.signal, category.year)
      if(res?.data) {
        setList(res.data.users)
      } else {
        if(res) showMsg(res.msg)
      }
    }

    return () => controller.abort()
  }

  useEffect(() => {
    if (!inputVal.trim()) {
      setSearchResults([])
      return
    }

    const filtered = list.reduce<AlphabetItem[]>((acc, item) => {
      const matchedDatas = item.datas.filter(data =>
        data.name.toLowerCase().includes(inputVal.toLowerCase())
      )

      if (matchedDatas.length > 0) {
        acc.push({
          initial: item.initial,
          datas: matchedDatas
        })
      }

      return acc
    }, [])

    setSearchResults(filtered)
  }, [inputVal, list])
  
  //面包屑
  const breadcrumbTitle = '通讯录'

  //第一层：分类列表
  const renderCategoryLevel = () => {
    if (type === '0') {
      // 校友通讯录：显示"全部好友"和年级列表
      return (
        <View className='contact-category'>
          <View
            className='contact-category-item'
            onClick={() => handleCategoryClick({ name: '全部好友', type: 'all' })}
          >
            <Text>全部好友</Text>
            <Image src={`${myImgBase}/itemArrow.png`} className='arrow' />
          </View>
          {enrollmentYears.map((year) => (
            <View
              key={year}
              className='contact-category-item'
              onClick={() => handleCategoryClick({ name: `${year}届校友`, type: 'year', year })}
            >
              <Text>{year}届校友</Text>
              <Image src={`${myImgBase}/itemArrow.png`} className='arrow' />
            </View>
          ))}
          {enrollmentYears.length === 0 && (
            <View style={{padding: '40px', textAlign: 'center', color: '#999'}}>
              <Text>加载中...</Text>
            </View>
          )}
        </View>
      )
    } else {
      // 其他类型：直接显示字母索引列表
      return null
    }
  }

  //第二层：人员列表
  const renderContactLevel = () => {
    return (
      <ScrollView scrollY style={{ height: windowHeight }} scrollIntoView={alpha} className='alphabet-scroll-view'>
        <View className="alphabet-list">
          {list.map((item) => (
            <View key={item.initial} id={item.initial} className="section-item">
              <View className="section-item-header">
                {item.initial}
              </View>
              <View className="section-item-cells">
                {item.datas.map((value, cellIndex) => (
                  <ContactItem className={`section-item-cell ${cellIndex !== (item.datas.length - 1) ? 'border-bottom' : ''}`} key={cellIndex} name={value.name} id={value.id} avatar={value.avatar} type={type === '0' ? '个人' : '组织'} />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    )
  }


  return (
    <View className='alphabet'>
      <View className='search-area'>
        <SearchTab setIsInputing={setIsInputing} getInputVal={getInputVal} />
      </View>

      {/* 面包屑导航 */}
      {type === '0' && (
        <View className='contact-breadcrumb'>
          <View className='breadcrumb-item'>
            <Text
              className={currentLevel === 0 ? 'current' : ''}
              onClick={() => handleBreadcrumbClick(0)}
            >
              {breadcrumbTitle}
            </Text>
            {selectedCategory && <Text className='separator'>{'>'}</Text>}
          </View>
          {selectedCategory && (
            <View className='breadcrumb-item'>
              <Text className={currentLevel === 1 ? 'current' : ''}>
                {selectedCategory.name}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* 内容区域 */}
      {type === '0' ? (
        // 校友通讯录：两层结构
        <View className='contact-levels' style={{ transform: `translateX(-${currentLevel * 50}%)` }}>
          {/* 第一层：分类列表 */}
          <View className='contact-level'>
            {renderCategoryLevel()}
          </View>
          {/* 第二层：人员列表 */}
          <View className='contact-level'>
            {!selectedCategory ? (
              <View style={{padding: '40px', textAlign: 'center', color: '#999'}}>
                <Text>请选择分类</Text>
              </View>
            ) : list.length === 0 ? (
              <VoidHint type={ type === '0' ? '校友通讯录' : type === '1' ? '组织通讯录' : '他人加入的组织' } />
            ) : (
              renderContactLevel()
            )}
          </View>
        </View>
      ) : (
        // 其他类型：直接显示列表
        <>
          {list.length === 0 ? (
            <VoidHint type={ type === '0' ? '校友通讯录' : type === '1' ? '组织通讯录' : '他人加入的组织' } />
          ) : (
            !isInputing ? (
              <ScrollView scrollY style={{ height: windowHeight }} scrollIntoView={alpha} className='alphabet-scroll-view'>
                <View className="alphabet-list">
                  {list.map((item) => (
                    <View key={item.initial} id={item.initial} className="section-item">
                      <View className="section-item-header">
                        {item.initial}
                      </View>
                      <View className="section-item-cells">
                        {item.datas.map((value, cellIndex) => (
                          <ContactItem className={`section-item-cell ${cellIndex !== (item.datas.length - 1) ? 'border-bottom' : ''}`} key={cellIndex} name={value.name} id={value.id} avatar={value.avatar} type={type === '0' ? '个人' : '组织'} />
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : (
              searchResults.length === 0 && inputVal.trim() ? (
                <VoidHint type="未找到相关联系人" />
              ) : (
                searchResults.flatMap((item) => item.datas).map((value, index, arr) => (
                  <ContactItem
                    className={`section-item-cell ${index !== arr.length - 1 ? 'border-bottom' : ''}`}
                    key={value.id}
                    name={value.name}
                    id={value.id}
                    avatar={value.avatar}
                    type={type === '0' ? '个人' : '组织'}
                  />
                ))
              )
            )
          )}
        </>
      )}

      {/* 字母选择器 - 只在非搜索状态且非校友通讯录分类列表时显示 */}
      {!isInputing && (type !== '0' || currentLevel === 1) && (
        <View data-id="selector" onTouchStart={handlerAlphaTap} onTouchMove={handlerMove} className="alphanet-selector">
          {list.map((item) => (
            <View key={item.initial} data-ap={item.initial} className="selector-one">
              {item.initial}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};