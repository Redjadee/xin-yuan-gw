import { useState, useEffect, useRef } from 'react'
import { View, ScrollView } from '@tarojs/components'
import VoidHint from '@/global/components/VoidHint'
import SearchTab from '@/global/components/SearchTab'
import ContactItem from '@/myPkg/components/ContactItem'
import Taro, { useLoad } from '@tarojs/taro'
import { contactList } from '@/global/utils/api/usercenter/friend'
import { orgContactList } from '@/global/utils/api/activitycenter/org'
import { showMsg } from '@/global/utils/common'

import './index.scss'

type AlphabetItem = {
  initial: string
  datas: {
    id: string
    name: string
    avatar: string
  }[]
}

export default function AlphabetList() {
  const [ type, setType ] = useState('')
  const [ id, setId ] = useState('')
  useLoad(options => {
    setType(options.type)
    if(options.type === '2') setId(options.id)
  })
  
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

  useEffect(() => {
    const controller = new AbortController()

    const getList = async () => {
      if(type === '0') {
        const res = await contactList(controller.signal)
        if(res?.data) {
          setList(res.data.users)
        } else {
          if(res) showMsg(res.msg)
        }
      } else {
        const res = await orgContactList(controller.signal, id)
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
  
  return (
    <View className='alphabet'>
      <View className='search-area'>
        <SearchTab setIsInputing={setIsInputing} getInputVal={getInputVal} />
      </View>
      { list.length === 0 ?
      <VoidHint type={ type === '0' ? '校友通讯录' : type === '1' ? '组织通讯录' : '他人加入的组织' } /> :
      (!isInputing ? <ScrollView scrollY style={{ height: windowHeight }} scrollIntoView={alpha} className='alphabet-scroll-view'>
        <View className="alphabet-list">
          {list.map((item) => (
            <View key={item.initial} id={item.initial} className="section-item">
              <View className="section-item-header">
                {item.initial}
              </View>
              <View className="section-item-cells">
                {item.datas.map((value, cellIndex) => (
                  <ContactItem className={`section-item-cell ${cellIndex !== (item.datas.length - 1) ? 'border-bottom' : ''}`} key={cellIndex} name={value.name} id={value.id} avatar={value.avatar} type={type === '0' ? '校友' : '组织'} />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView> :
        (searchResults.length === 0 && inputVal.trim() ?
          <VoidHint type="未找到相关联系人" /> :
          searchResults.map((item, index) => (
            <View key={`section-${index}`}>
              <View className="section-item-header">
                {item.initial}
              </View>
              <View className="section-item-cells">
                {item.datas.map((value, cellIndex) => (
                  <ContactItem className={`section-item-cell ${cellIndex !== (item.datas.length - 1) ? 'border-bottom' : ''}`} key={cellIndex} name={value.name} id={value.id} avatar={value.avatar} type={type === '0' ? '校友' : '组织'} />
                ))}
              </View>
            </View>
          ))
        )
      )}
      <View data-id="selector" onTouchStart={handlerAlphaTap} onTouchMove={handlerMove} className="alphanet-selector">
        {list.map((item) => (
          <View key={item.initial} data-ap={item.initial} className="selector-one">
            {item.initial}
          </View>
        ))}
      </View>
    </View>
  );
};