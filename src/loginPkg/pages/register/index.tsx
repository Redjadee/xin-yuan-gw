import { View, Text, Form, Input, Button, Image } from '@tarojs/components'
import Title from '@/loginPkg/components/Title'
// import MyCheckBox from '@/loginPkg/components/MyCheckBox'
import GetSmsCode from '@/loginPkg/components/GetSmsCode'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { verifystudentinfo, bindwechat } from '@/global/utils/api/usercenter/user'
import { studentregister } from '@/global/utils/api/usercenter/base'
import { showMsg } from '@/global/utils/common'
import { sha1 } from 'js-sha1'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '@/store/authSlice'
import { verifySuccess } from '@/store/authSlice'

import { homeImgBase } from '@/global/assets/images/imgBases'
import './index.scss'
import '@/global/style/form.scss'

export default function Register() {
  const [type, setType] = useState('')
  
  useLoad((options) => {
    setType(options.type)
  })

  const [ name, setName ] = useState('')
  const [ stuId, setStuId ] = useState('')
  const [ id, setId ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ phone, setPhone ] = useState('')
  const [ code, setCode ] = useState('')
  
  //同意协议政策
  // const [ agree, setAgree ] = useState(false)
  // const toggleAgree = () => setAgree(!agree)

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
  
  const dispatch = useDispatch()
  
  const privacyCheck = () => {
    // 1. 获取隐私设置，判断是否需要授权
    Taro.getPrivacySetting({
      success: res => {
        if (res.needAuthorization) {
          // 2. 需要授权：直接调用 requirePrivacyAuthorize
          // 【关键点】：此时全局不要有 Taro.onNeedPrivacyAuthorization 的监听代码
          // 微信发现你没监听，且这里请求了授权，就会自动弹出官方弹窗
          Taro.requirePrivacyAuthorize({
            success: () => {
              // 用户点击了官方弹窗的“同意”
              console.log('官方弹窗：用户同意')
              handleSubmit()
            },
            fail: () => {
              // 用户点击了官方弹窗的“拒绝”
              console.log('官方弹窗：用户拒绝')
              // 这里可以加个 Toast 提示用户必须授权才能登录
              Taro.showToast({ title: '需要同意隐私协议才能登录', icon: 'none' })
            }
          })
        } else {
          // 3. 不需要授权（之前同意过，ec.）：直接登录
          handleSubmit()
        }
      },
      fail: err => console.log(err)
    })
  }

  const handleSubmit = async () => {
    // if(type === '0' && !agree) {
    //   showMsg('请先同意相关协议')
    //   return
    // }
    if(type === '0') {
      const res = await studentregister({ password: sha1(password), name, student_id: stuId, id_last_six: id, code, phone })
      if(res?.data) {
        dispatch(loginSuccess({ token: res.data.token }))
        dispatch(verifySuccess())
        showMsg(res.data.message)
        Taro.login({
          success: async res => {
            if(res.code) {
              const response = await bindwechat(res.code)
              if(response?.data) {
                console.log(response.data.message)
                Taro.reLaunch({ url: '/pages/index/index' })
              } else {
                if(response) showMsg(response.msg)
              }
            }
          }, 
          fail: err => {
            console.log('错误信息：', err.errMsg)
            showMsg("登录失败，请重新登录")
          }
        })
      } else {
        if(res) showMsg(res.msg)
      }
    } else {
      const res = await verifystudentinfo({ password: sha1(password), name, studentid: stuId, id_last_six: id, code, phone })
      if(res?.data) {
        dispatch(verifySuccess())
        showMsg(res.data.message)
        setTimeout(() => {
          Taro.reLaunch({ url: '/pages/index/index' })
        }, 2000)
      } else {
        if(res?.msg) showMsg(res?.msg)
      }
    }
  }

  return (
    <View className='register'>
      <Title>{type === '0' ? '注册' : '身份认证'}</Title>
      <Form className='form'>
        <Input value={name} onInput={e => setName(e.detail.value)} type='text' className='input' placeholder='请输入真实姓名' placeholderClass='inputPH'  />
        { showStuId && <View className='complex-input'>
          <Input value={stuId} onInput={e => setStuId(e.detail.value)} type='number' maxlength={11} className='input' placeholder='请输入学号（选填）' placeholderClass='inputPH' />
          <Text className='label' onClick={toForgot} >人工申诉</Text>
        </View> }
        <Input value={id} onInput={e => setId(e.detail.value)} maxlength={6} className='input' placeholder='请输入身份证后六位' placeholderClass='inputPH' />
        <Input value={password} onInput={e => setPassword(e.detail.value)} password className='input' placeholder='请输入密码' placeholderClass='inputPH' />
        <Input value={phone} onInput={e => setPhone(e.detail.value)} type='number' maxlength={11} className='input' placeholder='请输入手机号' placeholderClass='inputPH' />
        <View className='complex-input'>
          <Input value={code} onInput={e => setCode(e.detail.value)} type='number' maxlength={6} className='input' placeholder='请输入手机验证码' placeholderClass='inputPH' />
          <GetSmsCode phone={phone} />
        </View>
        <Button onClick={privacyCheck} className='button register-button'><Text>{ type === '0' ? '注册' : '确认'}</Text></Button>
        { type === '0' && <View className='foot-box' onClick={backToLogin}>
          <Text>已注册，去登录</Text>
          <Image src={`${homeImgBase}/headArrow.png`} className='arrow' />
        </View>}
        {/* { type === '0' && <View className='foot-box'>
          <MyCheckBox checked={agree} toggleChecked={toggleAgree}>
            <Text className='agreement'>已阅读并同意<Text>《用户协议》</Text><Text>《隐私政策》</Text></Text>
          </MyCheckBox>
        </View>} */}
        { type === '0' && <Text className='foot-box wechat-enpower'>注册即表明同意授权微信</Text>}
      </Form>
    </View>
  )
}