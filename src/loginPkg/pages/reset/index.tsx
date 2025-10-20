import { View, Text, Form, Input, Button } from "@tarojs/components"
import Title from "@/loginPkg/components/Title"
import { useState, useCallback } from "react"
import { forgetpasswordVerify } from "@/global/utils/api/usercenter/user"
import { useLoad } from "@tarojs/taro"
import Taro from "@tarojs/taro"
import { showMsg } from "@/global/utils/common"
import { sha1 } from "js-sha1"

import '@/loginPkg/style/form.scss'

export default function Reset() {
  const [ para, setPara ] = useState({
    token: '',
    code: ''
  })
  const handleSetPara = useCallback((key, value) => {
    setPara(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])
  
  useLoad(options => {
    handleSetPara('token', options.token)
    handleSetPara('code', options.code)
  })
  
  const [ password, setPassword ] = useState('')
  const [ confrim, setConfirm ] = useState('')

  const request = async () => {
    if(para) {
      const res = await forgetpasswordVerify(para.code, sha1(password), para.token)
      if(res?.data) {
        showMsg(res.data.message)
        setTimeout(() => {
          Taro.navigateBack({
            delta: 2
          })
        }, 2000)
      } else {
        if(res) showMsg(res.msg)
      }
    }
  }
  const handleSubmit = () => {
    if(confrim !== password) {
      showMsg('前后密码输入不一致')
    } else request()
  }

  return (
    <View className="reset">
      <Title>重置密码</Title>
      <Form>
        <Input value={password} onInput={e => setPassword(e.detail.value)} placeholder="请输入密码" placeholderClass="inputPH" className="input" />
        <Input value={confrim} onInput={e => setConfirm(e.detail.value)} placeholder="请再次确定密码" placeholderClass="inputPH" className="input" />
        <Button onClick={handleSubmit} className="button" ><Text>确定</Text></Button>
      </Form>
    </View>
  )
}