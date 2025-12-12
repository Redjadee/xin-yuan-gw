import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { myImgBase } from '@/global/assets/images/imgBases'

import './index.scss'

interface functionItemType {
  href: string
  label: string
  index: number
  url: string
  hideprofile: boolean
  openForbidden?: () => void
}

export default function FunctionItem({ href, label, index, url, hideprofile: permitted, openForbidden }: functionItemType) {
  const handleClick = () => {
    if(!openForbidden) {
      Taro.navigateTo({ url })
      return 
    }
    
    if(permitted) {
      Taro.navigateTo({ url })
    } else {
      if(openForbidden) openForbidden()
    }
  }
  return (
    <View 
      onClick={handleClick} 
      className='function-item'
      style={index === 1 ? {marginBottom: 6} : {}}
      key={`function-item-${index}`}>
      <Image className='href' src={href} />
      <Text className='label' >{label}</Text>
      <Image src={`${myImgBase}/itemArrow.png`} className='arrow'/>
    </View>
  )
}