import { View, Text } from "@tarojs/components"
import { ITouchEvent } from "@tarojs/components"
import './index.scss'

interface propsType {
  label: string
  onClick?: ((event: ITouchEvent) => void)
}

export default function AdminButton({ label, onClick }: propsType) {
  return (
    <View onClick={onClick} className="admin-button"><Text>{label}</Text></View>
  )
}