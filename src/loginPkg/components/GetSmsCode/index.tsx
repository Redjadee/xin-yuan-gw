import { Text, Button } from "@tarojs/components"
import { useEffect, useState } from "react"
import { requestsmscode } from "@/global/utils/api/usercenter/base"
import { isPhone } from "@/global/utils/validate"
import Taro from "@tarojs/taro"

import './index.scss'

//TODO
//防止
//功能实现

interface propsType {
  phone: string
}

export default function GetSmsCode({ phone }: propsType) {
  const [ disable, setDisable ] = useState(false)
  const [ cnt, setCnt ] = useState(3)

  useEffect(() => {
    if ( disable && cnt > 0 ) {
      const timer = setTimeout(() => {
        setCnt(cnt - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if ( cnt === 0 ) {
      setDisable(false)
      setCnt(3)
    }
  }, [disable, cnt])

  const handleClick = async () => {
    if(!isPhone(phone)) {
      Taro.showToast({
        title: '请输入正确手机号',
        duration: 1500,
        icon: "none"
      })
    } else {
      try {
        const result = await requestsmscode(phone)
        if (result && result.code === 0) {
          setDisable(true)
          Taro.showToast({
            title: '验证码已发送',
            duration: 1500,
            icon: "none"
          })
        } else if (result && result.code !== 0) {
          Taro.showToast({
            title: result.msg,
            duration: 1500,
            icon: "none"
          })
        }
      } catch (err) {
        console.log('sms报错:', err)
      }
    }
  }

  if (!disable) {
    return (
      <Button className="label able sms-button" onClick={handleClick}>
        <Text>获取验证码</Text>
      </Button>
    )
  } else {
    return (
      <Button className="label sms-button" disabled onClick={handleClick}>
        <Text>获取验证码({cnt}s)</Text>
      </Button>
    )
  }
}