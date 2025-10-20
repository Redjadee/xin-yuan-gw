import { View, Text, Form, Input, Image, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { wechatlogin as login, login as Nlogin, slidecaptcha, verifyslidecaptcha } from '@/global/utils/api/usercenter/base'
import { getuserinfo } from '@/global/utils/api/usercenter/user'
import type { slidecaptchaReturnType } from '@/global/utils/api/usercenter/base'
import { showMsg } from '@/global/utils/common'

import { useDispatch, useSelector } from 'react-redux'
import { loginSuccess, selectToken } from '@/store/authSlice'

import Title from '../../components/Title'
import MyCheckBox from '@/loginPkg/components/MyCheckBox'
import { loginImgBase, homeImgBase, captchaImgBase } from '@/global/assets/images/imgBases'

import { Base64 } from 'js-base64'
import { sha1 } from 'js-sha1'

import './index.scss'
import '../../style/form.scss'

interface slideType {
  slideData: slidecaptchaReturnType
  retryGetCaptcha: () => void
  startLogin: () => void
  closeSlide: () => void
}

function Slidecaptcha({ slideData, retryGetCaptcha, startLogin, closeSlide }: slideType) {
  const [ blockX, setBlockX ] = useState(0)//滑块的left值
  const [ blockWidth, setBlockWidth ] = useState<number>()//滑块宽度
  const [ retry, setRetry ] = useState(false) //获取滑块宽度

  const tileX = useMemo(() => slideData.tile_x*0.95+blockX, [slideData.tile_x, blockX])
  
  //计算滑动
  const getRect = (callback: (rect) => void) => {
    const query = Taro.createSelectorQuery()
    query.select('#slide-box').boundingClientRect(callback).exec()
  }
  useEffect(() => {
    getRect((rect) => {
      if ( rect ) {
        const { width } = rect
        setBlockWidth(width)
      }
    })
  }, [retry])

  const [ startX, setStartX ] = useState(0)
  const handleBlockStart = (e) => {
    const touch = e.touches[0]
    setStartX(touch.clientX)
  }
  const handleBlockMove = (e) => {
    const touch = e.touches[0]
    const touchX = touch.clientX
    if(blockWidth) {
      const newX = Math.max(0, Math.min(320*0.9-80*0.9, touchX - startX))
      setBlockX(() => newX)
    } else {
      setRetry(!retry)
    }
  }
  const handleBlockEnd = async () => {
    setBlockX(0)
    const retry = () => {
      retryGetCaptcha()
      showMsg('验证失败', false, 600)
    }

    try {
      const res = await verifyslidecaptcha({ 
        captcha_id: slideData.captcha_id,
        src_x: Math.round(tileX/0.95),
        src_y: slideData.tile_y
      })
      if(res) {
        showMsg('验证成功', true)
        startLogin()
      }
      else retry()  
    } catch (err) {
      console.log(err)
      retry()
    }
  }

  const handleBgClick = () => closeSlide()
  return (
    <View className='slide-code' onClick={handleBgClick}>
    <View className='content-container'>
    <View className='content'>
      <View className='header'>
        <Text className='hint'>请拖动滑块完成拼图</Text>
        <Image onClick={retryGetCaptcha} className='retry' src={`${captchaImgBase}/refresh.png`} />
      </View>
      <View className='main'>
        <Image className='master'
        src={slideData.master_image} />
        <Image style={{ height: slideData.tile_height*0.95, width: slideData.tile_width*0.95, position: 'absolute', top: slideData.tile_y*0.95, left: tileX, zIndex: 10 }}  
        src={slideData.tile_image}/>
      </View>
      <View className='slide'>
        <View className='track'></View>
        <Image onTouchEnd={handleBlockEnd} onTouchStart={handleBlockStart} onTouchMove={handleBlockMove} id='slide-box' style={{ left: blockX }} className='block' src={`${captchaImgBase}/slideBlock.png`} />
      </View>
    </View>
    </View>
    </View>
  )
}

export default function Login() {
  useLoad(() => {
    console.log('Page loaded.')
  })

  //登录状态
  const dispatch = useDispatch()
  const [ loginStart, setLoginStart ] = useState(false)
  const startLogin = () => setLoginStart(true)

  //登录参数
  const [ remember, setRemember ] = useState(false)
  const switchRemember = () => setRemember(!remember)
  const [ account, setAccount ] = useState('')
  const [ password, setPassword ] = useState('')
  
  //验证码
  const [ slideData, setSlideData ] = useState<slidecaptchaReturnType>()
  const [ showSlide, setShowSlide ] = useState(false)
  const closeSlide = () => setShowSlide(false)
  const [ retry, setRetry ] = useState(false)
  const retryGetCaptcha = () => setRetry(!retry)

  const showCaptcha = useMemo(() => { //在show前再次检查，如果data获取失败，重试
    if(showSlide) {
      if(slideData) return true
      else setRetry(!retry) 
    }
    return false
  }, [showSlide, slideData])
  
  //获取验证码
  useEffect(() => {
    const controller = new AbortController()

    const getSlide = async (signal: AbortSignal) => {
      const res = await slidecaptcha(signal)
      if(res) setSlideData(res)
    }
    getSlide(controller.signal)

    return () => controller.abort()
  }, [retry])

  //记住密码
  //查本地存储
  useEffect(() => {
    const res = Taro.getStorageInfoSync()
    const [ remember, account, password ] = res.keys
    setRemember(!!remember)
    if(remember && account && password) {
      setAccount(account)
      setPassword(Base64.decode(password))
    }
  }, [])

  //在登录成功后，保存密码
  const saveRemember = () => {
    Taro.setStorageSync('remember', remember)
    if (remember) {
      Taro.setStorageSync(account, 'account')
      Taro.setStorageSync(Base64.encode(password), 'password')
    }
  }

  //Router
  const toForgot = () => Taro.navigateTo({
    url: '/loginPkg/pages/forgot/index?type=0'
  })
  const toRegister = () => Taro.navigateTo({
    url: '/loginPkg/pages/register/index?type=0'
  })
  //登录成功后，查信息是否完整
  const token = useSelector(selectToken)
  const backRouter = (infor?: boolean) => {
    if(infor !== undefined) {
      showMsg("登录成功！", true)
      setTimeout(() => {
        Taro.reLaunch({ url: infor ? '/pages/index/index' : '/loginPkg/pages/register/index?type=1' })
      }, 2000)
    } else {
      showMsg('查询信息失败，请稍后再试')
    }
  }
  useEffect(() => {
    const controller = new AbortController()

    const getInfor = async () => {
      try {
        const res = await getuserinfo('0', controller.signal)
        if(res?.data) {
          const { userinfo } = res.data
          backRouter(userinfo.isverified)
        } else {
          console.log(res?.msg)
        }
      } catch (err) {
        console.log(err)
      }
    }
    if(token) getInfor()

    return () => controller.abort()
  }, [token])
  //button
  useEffect(() => {
    const controller = new AbortController()

    const normalLogin = async () => {
      if(slideData)
      try {
          const res = await Nlogin({
            captcha_id: slideData?.captcha_id,
            password: sha1(password),
            phone: account
          })
          closeSlide()
          if (res?.data) {
            const { token } = res.data
            saveRemember()
            dispatch(loginSuccess({ token }))
          } else {
            if(res) showMsg(res.msg)
          }
        } catch (err) {
          console.log(err)
        }
    }
    if(loginStart) normalLogin()

    return () => controller.abort()
  }, [loginStart])
  const normalLoginClick = () => {
    if(password === '' && account === '') showMsg('账号密码不能为空')
    else if(account === '') showMsg('账号不能为空')
    else if(password === '') showMsg('密码不能为空')
    else {
      setLoginStart(false) //重置状态
      setRetry(!retry) //重置验证码
      setShowSlide(true) //验证码显示
    }
  }
  const wechatLogin = () => {
    Taro.login({
      success: async res => {
        if (res.code) {
          const response = await login(res.code)
          if (response?.data) {
            const { token } = response?.data
            dispatch(loginSuccess({ token }))
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
  }
  
  return (
    <View className='login'>
      <Title>账号密码登录</Title>
      <Form>
        <View>
          <Input value={account} onInput={e => setAccount(e.detail.value)} type='text' maxlength={11} placeholder='请输入手机号' placeholderClass='inputPH' className='input' />
          <Input value={password} onInput={e => setPassword(e.detail.value)} password placeholder='请输入密码' placeholderClass='inputPH' className='input' />
        </View>
        <View className='below-box'>
          <MyCheckBox checked={remember} toggleChecked={switchRemember}>
            <Text style={ remember ? { color: '#3A3A3A' } : undefined }>记住密码</Text>
          </MyCheckBox>
          <Text onClick={toForgot}>忘记密码？</Text>
        </View>
        <Button className='button' onClick={normalLoginClick}><Text>登录</Text></Button>
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
      { showCaptcha && slideData && <Slidecaptcha closeSlide={closeSlide} startLogin={startLogin} retryGetCaptcha={retryGetCaptcha} slideData={slideData} />}
    </View>
  )
}
