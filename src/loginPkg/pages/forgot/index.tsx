import { View, Text, Form, Input, Button, Textarea } from "@tarojs/components"
import Title from "@/loginPkg/components/Title"
import GetSmsCode from "@/loginPkg/components/GetSmsCode"
import { useLoad } from "@tarojs/taro"
import { useState } from "react"
import { forgetpasswordRequest } from "@/global/utils/api/usercenter/user"
import Taro from "@tarojs/taro"
import { forgetstudentid } from '@/global/utils/api/usercenter/user'

import './index.scss'
import '@/loginPkg/style/form.scss'
import { showMsg } from "@/global/utils/common"

export default function Forgot() {
  const [type, setType] = useState('')
  useLoad((options) => {
    setType(options.type)
  })

  //忘记密码
  const [ phone, setPhone ] = useState('')
  const [ code, setCode ] = useState('')

  //人工申诉
  const [ contract, setContract ] = useState('')
  const [ content, setContent ] = useState('')
  const [ showPh, setShowPh ] = useState(true)
  
  const textareaPlaceHolder = 
  `您可以给我们提供以下信息：
  1、姓名
  2、身份证号后六位
  3、入学年份
  4、就读专业
  5、手机号
  方便我们更好的帮助您进行查看`

  const handleInput = (e) => { //FIXME 输入时 若内容为空 显示ph
    setShowPh(false)
    setContent(() => e.detail.value)
  }
  const handleFocus = () => {
    setShowPh(false)
  }
  const handleBlur = () => {
    if(content === '') setShowPh(true)
  }

  //router
 const confirmRouter = async () => {
    if (type === '0') { //TODO Test
      const res = await forgetpasswordRequest(code, phone)
      if(res?.data) {
        const { token } = res.data
        Taro.navigateTo({
          url: `/loginPkg/pages/reset/index?token=${token}&code=${code}`,
        })
      } else {
        if(res) showMsg(res.msg)
      }
    } else {
      const res = await forgetstudentid(contract, content)
      console.log("contract content res", contract, ' ', content, ' ', res)
      if(res?.data) {
        showMsg(res.data.message)
        setTimeout(() => {
          Taro.reLaunch({ url: '/pages/index/index'})
        }, 2000)
      } else {
        if(res) showMsg(res.msg)
      }
    }
  }

  if (type === '0') {
    return (
      <View className="forgot"> 
        <Title>忘记密码</Title>
        <Form className="form">
          <Input value={phone} onInput={(e) => setPhone(e.detail.value)}  maxlength={11} type="number" placeholder="请输入手机号" placeholderClass="inputPH" className="input" />
          <View className="complex-input">
            <Input value={code} onInput={e => setCode(e.detail.value)} maxlength={6} type="number" placeholder="请输入手机验证码" placeholderClass="inputPH" className="input" />
            <GetSmsCode phone={phone} />
          </View>
          <Button onClick={confirmRouter} className="button forgot-button" ><Text>确定</Text></Button>
        </Form>
      </View>
    )
  } else {
    return (
      <View className="forgot">
        <Title>人工申诉</Title>
        <Form className="form">
          <Input value={contract} onInput={e => setContract(e.detail.value)} placeholder="请输入联系方式" placeholderClass="inputPH" className="input" />
          <View className="textarea-container">
            <Textarea maxlength={300} className="textarea" onFocus={handleFocus} onBlur={handleBlur} onInput={handleInput} />
            { showPh && <View><Text className="textarea-ph">{textareaPlaceHolder}</Text><Text className="hint">不多于300字</Text></View> }
          </View>
          <Button onClick={confirmRouter} className="button manual-button"><Text>确认</Text></Button>
        </Form>
      </View>
    )
  }
}