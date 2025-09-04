import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'

import { myImgBase } from '@/global/assets/images/imgBases'

import './index.scss'

interface functionItemType {
  href: string
  label: string
  index: number
  url: string
}
function FunctionItem({ href, label, index, url }: functionItemType) {
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


export default function My () {
  useLoad(() => {
    console.log('Page loaded.')

  })
  // ~pending:未来用全局状态储存登陆状态，以下包括在内，获取即可
  const profileHref = `${myImgBase}/defaultMyProfile.png`
  const name = '信息人'
  const brief = '个人简介'

  const arrowHref = `${myImgBase}/myDetail.png`
  const arrowUrl = ''
  const functionItemList  = [
    {
      href: `${myImgBase}/item1.png`,
      label: '校友通讯录',
      url: ''
    },
    {
      href: `${myImgBase}/item2.png`,
      label: '加入的组织',
      url: ''
    },
    {
      href: `${myImgBase}/item3.png`,
      label: '参与活动',
      url: ''
    },
    {
      href: `${myImgBase}/item4.png`,
      label: '账号设置',
      url: ''
    }
  ]

  return (
    <View className='my'>
      <View className='head'>
        <Image src={`${myImgBase}/bgimg.png`} className='head-bgimg' />
        <View className='head-wrapper' onClick={() => Taro.navigateTo({ url: arrowUrl })}>
          <Image src={profileHref} className='profile' />
          <View className='middle-box'>
            <Text className='name'>{name}</Text>
            <Text className='brief' >{brief}</Text>
          </View>
          <Image src={arrowHref} className='arrow'  />
        </View>
      </View>
      {functionItemList.map((value, index) => FunctionItem({...value, index}))}
    </View>
  )
}
