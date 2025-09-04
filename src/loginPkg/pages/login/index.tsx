import { View, Text, Form, Input, Image, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { wechatlogin as login } from '@/global/utils/api/user'

import { loginImgBase, homeImgBase } from '@/global/assets/images/imgBases'

import './index.scss'
import '../../style/form.scss'

export default function Login () {
  useLoad(() => {
    console.log('Page loaded.')
  })
  const [ remember, setRemember ] = useState(false)

  //button
  const wechatLogin = () => Taro.login({
    success: async res => {
      if (res.code) {
        const token = await login(res.code)
        //TODO 跳完善资料页面，顺便把token传过去，在那个页面将全局auth修改
      } else {
        Taro.showToast({
          title: '登录失败，请稍后再试'
        })
      }
    },
    fail: err => {
      console.log('错误信息：', err.errMsg)
    }
  })

  //Router
  const toForgot = () => Taro.navigateTo({
    url: '/loginPkg/pages/forgot/index'
  })
  const toRegister = () => Taro.navigateTo({
    url: '/loginPkg/pages/register/index'
  })
  return (
    <View className='login'>
      <View className='title-box'>
        <Text className='title'>账号密码登录</Text>
      </View>
      <Form>
        <View>
          <Input type='text' maxlength={11} placeholder='请输入手机号或者学号' placeholderClass='inputPH' className='input' />
          <Input password placeholder='请输入密码' placeholderClass='inputPH' className='input' />
        </View>
        <View className='below-box'>
          <View className='remember-box' onClick={() => setRemember(!remember)}>
            <View className='checkbox'>
              { remember && <Image className='checkbox-s' src={`${loginImgBase}/checkedbox.png`} /> }
            </View>
            <Text style={ remember ? { color: '#3A3A3A' } : undefined }>记住密码</Text>
          </View>
          <Text onClick={toForgot}>忘记密码？</Text>
        </View>
        <Button className='button'><Text>登录</Text></Button>
      </Form>
        <Button className='button wechat' onClick={wechatLogin} >
          <View className='box'>
            <Image src={`${loginImgBase}/wechatLogo.png`} className='logo' />
            <Text>微信快速登录</Text>
          </View>
        </Button>
        <View className='register' onClick={toRegister} >
          <Text>新用户注册</Text>
          <Image src={`${homeImgBase}/headArrow.png`} className='arrow' />
        </View>
    </View>
  )
}
