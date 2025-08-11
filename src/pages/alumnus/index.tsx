import { View, Text } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Alumnus () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='alumnus'>
      <Text>Hello world!</Text>
    </View>
  )
}
