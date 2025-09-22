import { View, Text, Form, Input, Image, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useCallback, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { wechatlogin as login, graphiccode, login as Nlogin } from '@/global/utils/api/usercenter/base'

import { useDispatch } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '@/store/authSlice'

import Title from '../../components/Title'
import MyCheckBox from '@/loginPkg/components/MyCheckBox'
import { loginImgBase, homeImgBase } from '@/global/assets/images/imgBases'

import './index.scss'
import '../../style/form.scss'

interface captchaType {
  onReady: (id: string) => void
  className?: string
}

function GraphCaptcha({ onReady, className }: captchaType) {
  // 关于图形验证码的state
  const [ loading, setLoading ] = useState(false)
  const [ err, setErr ] = useState(false)
  
  const [ img, setImg ] = useState('')

  const fetchGraphicCode = useCallback(async (isMounted: boolean) => {
    setLoading(true)
    setErr(false)
    try {
      const res: any = await graphiccode()
      if (!isMounted) return
      if (res) {
        const { captcha_id, captcha_image } = res
        setImg(captcha_image)
        onReady(captcha_id)
      }
    } catch (e) {
      console.log(e)
      setErr(true)
    } finally {
      setLoading(false)
    }
  }, [onReady])
  
  useEffect(() => {
    let isMounted = true
    fetchGraphicCode(isMounted)
    return () => {
      isMounted = false
    }
  }, [fetchGraphicCode])

  if (loading) return (
    <View className={`${className}`} ><Text>加载中…</Text></View>
  )
  if (err) return (
    <View className={`${className}`} onClick={() => fetchGraphicCode(true)}><Text>加载失败，点击重试</Text></View>
  )
  return (
    <View className={`${className}`} onClick={() => fetchGraphicCode(true)}><Image src={img} /></View>
  )
}

export default function Login () {
  useLoad(() => {
    console.log('Page loaded.')
  })
  //登录状态
  const dispatch = useDispatch()

  //登录参数
  const [ remember, setRemember ] = useState(false)
  const [ account, setAccount ] = useState('')
  const [ password, setPassword ] = useState('')
  
  //图形验证码
  // const [ showcap, setShowcap ] = useState(false)
  const [ capid, setCapid ] = useState('1234') //测试数据
  // const getCapId = (id: string) => setCapid(id)

  //记住密码
  //TODO 加密之后，存储密码
  //查本地存储
  useEffect(() => {
    const res = Taro.getStorageInfoSync()
    const [ remember, account, token ] = res.keys
    setRemember(!!remember)
    if(remember && account && token) {
      setAccount(account)
      setPassword('********')
    }
  }, [])
  const switchRemember = () => setRemember(!remember)
  //在登录成功后，保存密码
  const saveRemember = (token: string) => {
    Taro.setStorageSync('remember', remember)
    if (remember) {
      Taro.setStorageSync(account, 'account')
      Taro.setStorageSync(token, 'token')
    }
  }

  //button
  const normalLogin = async () => {
    // setShowcap(true)
    try {
      const token = await Nlogin({
        captcha_id: capid,
        captcha_code: '1234', //测试数据
        password,
        phone: account
      })
      console.log(token) //测试
      if (token) {
        saveRemember(token)
        dispatch(loginSuccess({ userId: '0', token }))
        backHomeRouter()
      }
    } catch (err) {
      console.log(err)
    }
  }
  const wechatLogin = () => {
    dispatch(loginStart())
    Taro.login({
      success: async res => {
        if (res.code) {
          const token = await login(res.code)
          if (token) {
            //TODO
            // 获取自己的信息，如果获取不到 
            // 跳完善资料页面
            dispatch(loginSuccess({ userId: '0', token }))
            backHomeRouter()
          }
        }
      },
      fail: err => {
        dispatch(loginFailure(err))
        console.log('错误信息：', err.errMsg)
        errToast()
      }
    })
  }
  const backHomeRouter = () => {
    console.log('😊登录成功')
    Taro.showToast({
      title: '登录成功！',
      icon: 'success',
      duration: 2000,
      mask: true
    })
    setTimeout(() => {
      Taro.reLaunch({ url: '/pages/index/index' })
    }, 2000);
  }
  const errToast = () => {
    Taro.showToast({
      title: '登录失败，请重新登录',
      duration: 1500
    })
  }
  //Router
  const toForgot = () => Taro.navigateTo({
    url: '/loginPkg/pages/forgot/index?type=0'
  })
  const toRegister = () => Taro.navigateTo({
    url: '/loginPkg/pages/register/index?type=0'
  })
  return (
    <View className='login'>
      <Title>账号密码登录</Title>
      <Form>
        <View>
          <Input value={account} onInput={e => setAccount(e.detail.value)} type='text' maxlength={11} placeholder='请输入手机号或者学号' placeholderClass='inputPH' className='input' />
          <Input value={password} onInput={e => setPassword(e.detail.value)} password placeholder='请输入密码' placeholderClass='inputPH' className='input' />
        </View>
        <View className='below-box'>
          <MyCheckBox checked={remember} toggleChecked={switchRemember}>
            <Text style={ remember ? { color: '#3A3A3A' } : undefined }>记住密码</Text>
          </MyCheckBox>
          <Text onClick={toForgot}>忘记密码？</Text>
        </View>
        <Button className='button' onClick={normalLogin}><Text>登录</Text></Button>
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
      {/* <GraphCaptcha onReady={getCapId} className={showcap ? 'show' : ''} /> */}
    </View>
  )
}
