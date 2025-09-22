import { View, Image } from "@tarojs/components"
import { loginImgBase } from "@/global/assets/images/imgBases"

import './index.scss'

interface propsType {
  checked: boolean
  toggleChecked: () => void
  children?: any
}

export default function MyCheckBox({ checked, toggleChecked, children }: propsType) {
  return (
    <View className='box' onClick={toggleChecked}>
      <View className='checkbox'>
        { checked && <Image className='checkbox-s' src={`${loginImgBase}/checkedbox.png`} /> }
      </View>
      {children}
    </View>
  )
}