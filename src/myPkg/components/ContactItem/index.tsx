import { View, Image, Text } from "@tarojs/components"
import './index.scss'

interface propsType {
  className: string
  id: string
  avatar: string
  name: string
}

export default function ContactItem({ className, id, avatar, name }: propsType) {
  
  return (
    <View className={`contact-item ${className}`} >
      <Image className="avatar" src={avatar} />
      <Text>{name}</Text>
    </View>
  )
}