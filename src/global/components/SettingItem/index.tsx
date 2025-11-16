import { View, Text, Image, Switch } from "@tarojs/components"
import { ITouchEvent } from "@tarojs/components"

import { myImgBase } from "@/global/assets/images/imgBases"
import './index.scss'
import { useMemo } from "react"

interface propsType {
  content: string
  isChecked?: boolean
  arrow?: boolean
  className?: string
  onToggle?: ((event: ITouchEvent) => void) | undefined
  onClick?: ((event: ITouchEvent) => void) | undefined
  rightLabel?: string
}

export default function SettingItem({ content, isChecked, arrow, className, onToggle, onClick, rightLabel }: propsType) {
  const rightContent = useMemo(() => {
    if(arrow && rightLabel) {
      return (
        <View className="right-label-box">
          <Text className="right-label">{rightLabel}</Text>
          <Image className="arrow" src={`${myImgBase}/itemArrow.png`} /> 
        </View>
      )
    } else if(arrow) {
      return ( <Image className="arrow" src={`${myImgBase}/itemArrow.png`} /> )
    } else if(rightLabel) {
      return ( <Text className="right-label">{rightLabel}</Text> )
    } else {
      return <Switch type='switch' color='#33A2C9' checked={isChecked} onClick={onToggle} />
    }
  }, [arrow, rightLabel, isChecked, onToggle])
  
  return (
    <View className={`SettingItem-box ${className}`} onClick={onClick} >
      <Text>{content}</Text>
       {rightContent}
    </View>
  )
}