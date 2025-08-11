import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function My () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='my'>
      <Text>Hello world!</Text>
    </View>
  )
}
