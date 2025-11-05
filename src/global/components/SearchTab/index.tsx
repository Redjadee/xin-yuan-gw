import { View, Image, Input } from "@tarojs/components"
import { alumnusImgBase } from "@/global/assets/images/imgBases"
import { useMemo, useState, useRef, useEffect } from "react"

import './index.scss'

interface propsType {
  className?: string
  getInputVal: (inputVal: string) => void
  setIsInputing: React.Dispatch<React.SetStateAction<boolean>>
  type?: '校友' | '组织'
}

export default function SearchTab({ setIsInputing, getInputVal, type, className }: propsType) {
  const label = useMemo(() => type ? `搜索你的${type}` : '请输入搜索内容', [type])

  const [ inputVal, setInputVal ] = useState('')
  const lastChangeTime = useRef(Date.now())
  const timerRef = useRef<any>(null)
  const lastValue = useRef('')

  useEffect(() => {
    const now = Date.now()

    // If value changed
    if (inputVal !== lastValue.current) {
      lastValue.current = inputVal
      lastChangeTime.current = now

      // Reset any previous timer
      if (timerRef.current) clearInterval(timerRef.current)

      // Start a check timer
      timerRef.current = setInterval(() => {
        const idleTime = Date.now() - lastChangeTime.current;
        if (idleTime >= 300) {
          clearInterval(timerRef.current)
          timerRef.current = null
          getInputVal(inputVal)
        }
      }, 100)
    }

    // Cleanup when component unmounts
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [inputVal])

  const isInputing = () => setIsInputing(true)
  const isntInputing = () => setIsInputing(false)
  const handleInput = e => setInputVal(e.detail.value)
  return (
    <View className={`search-bar ${className}`}>
      <Image src={`${alumnusImgBase}/search.png`} className='icon' />
      <Input value={inputVal} onFocus={isInputing} onBlur={isntInputing} onInput={handleInput} type='text' placeholder={label} placeholderTextColor='#CCC8C8' className='input' />
    </View>
  )
}