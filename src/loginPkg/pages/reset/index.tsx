import { View, Text, Form, Input, Button } from "@tarojs/components"
import Title from "@/loginPkg/components/Title"
import { useState, useCallback } from "react"
import { forgetpasswordVerify, changepassword } from "@/global/utils/api/usercenter/user"
import { useLoad } from "@tarojs/taro"
import Taro from "@tarojs/taro"
import { showMsg } from "@/global/utils/common"
import { sha1 } from "js-sha1"

import './index.scss'
import '@/global/style/form.scss'

/**
 * 重置密码/修改密码页面
 *
 * URL 参数说明：
 * @param type - 页面类型
 *   - '0': 忘记密码后重置（需要 token 和 code 参数）
 *   - '1': 修改密码（需要输入原密码）
 * @param token - 重置密码的临时令牌（type 为 '0' 时需要）
 * @param code - 验证码（type 为 '0' 时需要）
 */
export default function Reset() {
  const [ para, setPara ] = useState({
    type: '0',
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
    handleSetPara('type', options.type)
    handleSetPara('token', options.token)
    handleSetPara('code', options.code)
  })
  
  //reset
  const [ password, setPassword ] = useState('')
  const [ confrim, setConfirm ] = useState('')
  //renew
  const [ originPassword, setOriginPassword ] = useState('')
  const toForgot = () => Taro.navigateTo({ url: '/loginPkg/pages/forgot/index?type=0' })

  const request = async () => {
    if(para) {
      if(para.type === '0') {
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
      } else {
        const res = await changepassword(sha1(password), sha1(originPassword))
        if(res?.data) {
          showMsg(res.data.message)
        } else {
          if(res) showMsg(res.msg)
        }
      }
    }
  }
  const handleSubmit = () => {
    if(password === '') {
      showMsg('密码不能为空')
    } else if(confrim !== password) {
      showMsg('前后密码输入不一致')
    } else request()
  }

  return (
    <View className="reset">
      <Title>重置密码</Title>
      <Form className="form">
        { para.type === '1' &&
        <View className='complex-input'>
          <Input password value={originPassword} onInput={e => setOriginPassword(e.detail.value)} placeholder="请输入旧密码" placeholderClass="inputPH" className="input" /> 
          <Text className='label' onClick={toForgot}>忘记密码？</Text>
        </View> }
        <Input password value={password} onInput={e => setPassword(e.detail.value)} placeholder={ para.type === '1'? '请输入新密码' : "请输入密码"} placeholderClass="inputPH" className="input" />
        <Input password value={confrim} onInput={e => setConfirm(e.detail.value)} placeholder="请再次确定密码" placeholderClass="inputPH" className="input" />
        <Button onClick={handleSubmit} className="button reset-buttom" ><Text>确定</Text></Button>
      </Form>
    </View>
  )
}