import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
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
      <Image src=''className='arrow'/>
    </View>
  )
}


export default function My () {
  useLoad(() => {
    console.log('Page loaded.')
  })
  
  // ~pending:未来用全局状态储存登陆状态，以下包括在内，获取即可
  const profileHref = ''
  const name = '信息人'
  const brief = '个人简介'

  const arrowHref = ''
  const arrowUrl = ''
  const functionItemList = [
    {
      href: '',
      label: '校友通讯录',
      url: ''
    },
    {
      href: '',
      label: '加入的组织',
      url: ''
    },
    {
      href: '',
      label: '参与活动',
      url: ''
    },
    {
      href: '',
      label: '账号设置',
      url: ''
    }
  ]

  return (
    <View className='my'>
      <View className='head'>
        <View className='head-wrapper'>
          <Image src={profileHref} className='profile' />
          <View className='middle-box'>
            <Text className='name'>{name}</Text>
            <Text className='brief' >{brief}</Text>
          </View>
          <Image src={arrowHref} className='arrow' onClick={() => Taro.navigateTo({ url: arrowUrl })} />
        </View>
      </View>
      {functionItemList.map((value, index) => FunctionItem({...value, index}))}
    </View>
  )
}
