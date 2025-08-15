import { View, Text, Input, Image, ScrollView, } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'
import { useState } from 'react'

export default function Alumnus () {
  useLoad(() => {
    console.log('Page loaded.')
  })
  //head
  const [ label, setLabel ] = useState('校友')
  const [ blockStyle, setBlockStyle ] = useState('block')
  const headLabels = ['校友', '组织']
  function switchLabel(nowLabel: string) {
    if(nowLabel === label){}
    else {
      setLabel(nowLabel)
      setBlockStyle(label === '校友' && nowLabel === '组织' ? 'block block-switch' :  'block')   
    }
  }
  //body
  const bodyLabels = ['推荐', '全部', '同城', '同行', '同院']
  return (
    <View className='alumnus'>
      <View className='head'>
          <View className='switch'>
            <View className={blockStyle}></View>
            {headLabels.map((value, index) => (
              <Text className={['label', label === value ? 'label-selected': ''].join(' ')} onClick={() => switchLabel(value)} key={`alumnus-switch-${index}`}>{value}</Text>
            ))}
          </View>
          <View className='search-bar'>
            <Image src='' className='icon' />
            <Input type='text' placeholder={`搜索你的${label}`} placeholderTextColor='#CCC8C8' className='input' />
          </View>
      </View>
      <View className='body'>
        <ScrollView scroll-x enable-flex className='scroll-tab'>
        {bodyLabels.map((value, index) => (
          <Text className='label' key={`alumnus-scroll-${index}`}>{value}</Text>
        ))}
        </ScrollView>
      </View>
    </View>
  )
}
