import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { myImgBase } from '@/global/assets/images/imgBases'

import './index.scss'

interface functionItemType {
  href: string
  label: string
  index: number
  url: string
}

export default function FunctionItem({ href, label, index, url }: functionItemType) {
  //~pending: 确认路由正常
  return (
    <View 
      onClick={() => Taro.navigateTo({ url })} 
      className='function-item'
      style={index === 1 ? {marginBottom: 6} : {}}
      key={`function-item-${index}`}>
      <Image className='href' src={href} />
      <Text className='label' >{label}</Text>
      <Image src={`${myImgBase}/itemArrow.png`} className='arrow'/>
    </View>
  )
}