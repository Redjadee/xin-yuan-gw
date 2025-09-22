import { View, Text, Form, Input, Button } from "@tarojs/components"
import Title from "@/loginPkg/components/Title"
import GetSmsCode from "@/loginPkg/components/GetSmsCode"
import { useLoad } from "@tarojs/taro"
import { useState } from "react"
import { isPhone, isValidYear } from "@/global/utils/validate"
import Taro from "@tarojs/taro"

import './index.scss'
import '@/loginPkg/style/form.scss'

export default function Forgot() {
  const [type, setType] = useState('')
  useLoad((options) => {
    setType(options.type)
  })

  const [ phone, setPhone ] = useState('')


  const confirmRouter = () => {
    if (type === '0') {
      if (!isPhone(phone)) {
        //TODO 验证码不对 的检验
      } 
    } else {
      // if(!isValidYear())
      //TODO 专业、班级非空
    }
  }

  if (type === '0') {
    return (
      <View className="forgot"> 
        <Title>忘记密码</Title>
        <Form className="form">
          <Input value={phone} onInput={(e) => setPhone(e.detail.value)}  maxlength={11} type="number" placeholder="请输入手机号" placeholderClass="inputPH" className="input" />
          <View className="complex-input">
            <Input maxlength={6} type="number" placeholder="请输入手机验证码" placeholderClass="inputPH" className="input" />
            <GetSmsCode phone={phone} />
          </View>
          <Button onClick={confirmRouter} className="button forgot-button" ><Text>确定</Text></Button>
        </Form>
      </View>
    )
  } else {
    return (
      <View className="forgot">
        <Title>忘记学号</Title>
        <Form className="form">
          <Input maxlength={4} type="number" placeholder="请输入入学年份" placeholderClass="inputPH" className="input" />
          <Input placeholder="请输入分流专业" placeholderClass="inputPH" className="input" />
          <Input placeholder="请输入班级" placeholderClass="inputPH" className="input" />
          <Button onClick={confirmRouter} className="button forgot-button"><Text>确定</Text></Button>
        </Form>
      </View>
    )
  }
}