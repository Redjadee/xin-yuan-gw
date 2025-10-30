import { useMemo, useState } from "react"
import { Textarea, View, Text } from "@tarojs/components"

import './index.scss'

interface propsType {
  handleContent: (val: string) => void
  maxlength: number
  showPh?: boolean
  show?: () => void
  notshow?: () => void
  placeHolder?: string
  boxClass?: string
  textareaClass?: string
}

export default function TextArea({ showPh, show, notshow, handleContent, maxlength, placeHolder, boxClass, textareaClass }: propsType) {
  const [ inputted, setInputted ] = useState(false)
  const [ nowlength, setNowlength ] = useState(0)

  const textareaPlaceHolder = useMemo(() => {
    if(!placeHolder) { return `您可以给我们提供以下信息：
    1、姓名
    2、身份证号后六位
    3、入学年份
    4、就读专业
    5、手机号
    方便我们更好的帮助您进行查看`
        
    } else return placeHolder
  }, [placeHolder])

  const handleInput = (e) => {    
    if(e.detail.value === '') {
      if(show) show()
    }
    else {
      if(notshow) notshow()
    }
    setInputted(true)
    if(e.detail.value === '') setInputted(false)  
    setNowlength(e.detail.value.length)
  }
  const handleFocus = () => {
    if(notshow) notshow()
  }
  const handleBlur = (e) => {
    handleContent(e.detail.value)
    if(e.detail.value === '') {
      if(show) show()
    }
  }

  if(placeHolder) {
    return (
      <View className={`textarea-container ${boxClass}`}>
        <Textarea maxlength={maxlength} className={`textarea ${textareaClass}`} placeholderClass="textarea-ph-normal" placeholder={textareaPlaceHolder} onFocus={handleFocus} onBlur={handleBlur} onInput={handleInput} />
        <Text className="hint">{inputted ? `${nowlength}/${maxlength}` : `不多于${maxlength}字`}</Text>
      </View>
    )
  } else {
    return (
    <View className={`textarea-container ${boxClass}`}>
      <Textarea maxlength={maxlength} className={`textarea ${textareaClass}`} onFocus={handleFocus} onBlur={handleBlur} onInput={handleInput} />
      <View>
        { showPh && <Text className="textarea-ph">{textareaPlaceHolder}</Text> }      
        <Text className="hint">{inputted ? `${nowlength}/${maxlength}` : `不多于${maxlength}字`}</Text>
      </View>
    </View>
  )
  }
}