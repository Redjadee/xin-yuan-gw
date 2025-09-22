import { View, Text, Form, Input, Button, Image } from '@tarojs/components'
import Title from '@/loginPkg/components/Title'
import MyCheckBox from '@/loginPkg/components/MyCheckBox'
import GetSmsCode from '@/loginPkg/components/GetSmsCode'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'

import { homeImgBase } from '@/global/assets/images/imgBases'
import './index.scss'
import '../../style/form.scss'

//TODO
//功能实现

export default function Register() {
  const [type, setType] = useState('')
  
  useLoad((options) => {
    setType(options.type)
  })

  const [ phone, setPhone ] = useState('') //TODO useRef()
  
  //同意协议政策
  const [ agree, setAgree ] = useState(false)
  const toggleAgree = () => setAgree(!agree)

  //控制学号栏的显示与否  
  const [ showStuId, setShowStuId ] = useState(true)
  
  //router
  const toForgot = () => Taro.navigateTo({ 
    url: '/loginPkg/pages/forgot/index?type=1',
    events: {
      comfrimForgot: () => setShowStuId(false)
    } 
  })
  const backToLogin = () => {
    Taro.navigateBack({ delta: 1 })
  }
  return (
    <View className='register'>
      <Title>{type === '0' ? '注册' : '身份认证'}</Title>
      <Form className='form'>
        <Input type='text' className='input' placeholder='请输入真实姓名' placeholderClass='inputPH'  />
        <Input maxlength={6} className='input' placeholder='请输入身份证后六位' placeholderClass='inputPH' />
        { showStuId && <View className='complex-input'>
          <Input type='number' maxlength={11} className='input' placeholder='请输入学号' placeholderClass='inputPH' />
          <Text className='label' onClick={toForgot} >忘记学号？</Text>
        </View> }
        <Input password className='input' placeholder='请输入密码' placeholderClass='inputPH' />
        <Input value={phone} onInput={e => setPhone(e.detail.value)} type='number' maxlength={11} className='input' placeholder='请输入手机号' placeholderClass='inputPH' />
        <View className='complex-input'>
          <Input type='number' maxlength={6} className='input' placeholder='请输入手机验证码' placeholderClass='inputPH' />
          <GetSmsCode phone={phone} />
        </View>
        <Button className='button register-button'><Text>注册</Text></Button>
        <View className='foot-box' onClick={backToLogin}>
          <Text>已注册，去登录</Text>
          <Image src={`${homeImgBase}/headArrow.png`} className='arrow' />
        </View>
        <View className='foot-box'>
          <MyCheckBox checked={agree} toggleChecked={toggleAgree}>
            <Text className='agreement'>已阅读并同意<Text>《用户协议》</Text><Text>《隐私政策》</Text></Text>
          </MyCheckBox>
        </View>
      </Form>
    </View>
  )
}