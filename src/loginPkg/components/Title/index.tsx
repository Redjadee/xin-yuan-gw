import { View, Text } from "@tarojs/components"
import './index.scss'

export default function Title({children}) {
  return (
    <View className='title-box'>
      <Text className='title'>{children}</Text>
    </View>
  )
}