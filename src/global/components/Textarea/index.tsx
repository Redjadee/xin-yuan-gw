import { useMemo, useState, useEffect } from "react"
import { Textarea, View, Text } from "@tarojs/components"
import { showMsg } from "@/global/utils/common"

import './index.scss'

interface propsType {
  handleContent: (val: string) => void
  maxlength: number
  placeHolder?: string
  initialValue?: string
  //自定义placeholder控制
  showPh?: boolean
  show?: () => void
  notshow?: () => void
  //样式
  boxClass?: string
  textareaClass?: string
}

export default function TextArea({ showPh, show, notshow, handleContent, maxlength, placeHolder, boxClass, textareaClass, initialValue }: propsType) {
  const [ currentValue, setCurrentValue ] = useState(initialValue || '')
  const [ inputted, setInputted ] = useState(!!initialValue)
  const [ nowlength, setNowlength ] = useState(initialValue?.length || 0)

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
    const newValue = e.detail.value
    setCurrentValue(newValue)

    if(newValue === '') {
      if(show) show()
    }
    else {
      if(notshow) notshow()
    }
    setInputted(true)
    if(newValue === '') setInputted(false)
    setNowlength(newValue.length)
  }
  const handleFocus = () => {
    if(notshow) notshow()
  }
  const handleBlur = (e) => {
    const newValue = e.detail.value
    const isExceeded = newValue.length > maxlength

    if (isExceeded) {
      showMsg(`内容不能超过${maxlength}字`)
      return
    }

    handleContent(newValue)
    if(newValue === '') {
      if(show) show()
    }
  }

  const displayText = useMemo(() => inputted ? `${nowlength}/${maxlength}` : `不多于${maxlength}字`, [inputted, nowlength, maxlength])
  const isCountExceeded = useMemo(() => nowlength > maxlength, [nowlength, maxlength])

  // Update state when initialValue changes
  useEffect(() => {
    if (initialValue !== undefined) {
      setCurrentValue(initialValue)
      setNowlength(initialValue.length)
      setInputted(initialValue.length > 0)
    }
  }, [initialValue])

  if(placeHolder) {
    return (
      <View className={`textarea-container ${boxClass}`}>
        <Textarea
          className={`textarea ${textareaClass}`}
          placeholderClass="textarea-ph-normal"
          placeholder={textareaPlaceHolder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={handleInput}
          value={currentValue}
        />
        <Text className={`hint ${isCountExceeded ? 'exceeded' : ''}`}>{displayText}</Text>
      </View>
    )
  } else {
    return (
    <View className={`textarea-container ${boxClass}`}>
      <Textarea
        className={`textarea ${textareaClass}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        value={currentValue}
      />
      <View>
        { showPh && <Text className="textarea-ph">{textareaPlaceHolder}</Text> }
        <Text className={`hint ${isCountExceeded ? 'exceeded' : ''}`}>{displayText}</Text>
      </View>
    </View>
    )
  }
}