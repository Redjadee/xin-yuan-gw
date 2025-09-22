import { View, Image, Input } from "@tarojs/components"
import { alumnusImgBase } from "@/global/assets/images/imgBases"

import './index.scss'

interface propsType {
  className: string
}

export default function SearchTab({ className }: propsType) {
  return (
    <View className={`search-bar ${className}`}>
      <Image src={`${alumnusImgBase}/search.png`} className='icon' />
      <Input type='text' placeholder={'请输入搜索内容'} placeholderTextColor='#CCC8C8' className='input' />
    </View>
  )
}