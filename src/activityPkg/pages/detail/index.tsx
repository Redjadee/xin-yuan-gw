import { View, Text, Image } from "@tarojs/components"
import { useLoad } from '@tarojs/taro'
import { useEffect, useMemo, useState } from "react"
import Head from "@/pages/index/components/Head"
import MessageContainer from "@/pages/index/components/MessageContainer"
import PopWindow from "@/pages/alumnus/components/PopWindow"
import { homeImgBase } from "@/global/assets/images/imgBases"
import { showMsg } from "@/global/utils/common"

import { MsgType } from "@/pages/index/components/MessageContainer"
import { actiType } from "@/global/utils/api/activitycenter/activity"
import { detail, enroll, cancel } from "@/global/utils/api/activitycenter/activity"
import Taro from "@tarojs/taro"

import { testMsg } from "@/pages/index/initData"

import './index.scss'

interface buttonType {
  isparticipated: boolean
  toggle: () => void
}

function RegisButton({ isparticipated, toggle }: buttonType) {
  const label = useMemo(() => isparticipated ? '已报名' : '立即报名', [isparticipated])
  return (
    <View onClick={toggle} className={["regis", isparticipated && 'registered'].join(' ')}><Text>{label}</Text></View>
  )
}

export default function Detail() {
  //url参数
  const [ id, setId ] = useState('')
  useLoad((options) => {
    setId(options.id)
  })

  //请求 Hook
  const [ acti, setActi ] = useState<actiType>()
  const [ msgList, setMsgList ] = useState<MsgType[]>(testMsg)
  //报名状态
  const [ isparticipated, setIsparticipated ] = useState(false)  
  //活动事件
  const engage = async () => {
    const res: any = await enroll(id)
    console.log(res)
    if(res?.data) {
      Taro.requestSubscribeMessage({
        tmplIds: ['sq9RgdfesWBhMgxwFD_nyPkp1149q7Ycz6IMJPKExJM'],
        entityIds: [''], //支付宝用，但不写会报错
        success: res => {
          console.log('😊微信消息订阅: ', res)
        },
        fail: err => {
          console.log("微信消息订阅: ", err)
        }
      })
      
      setIsparticipated(true)
      showMsg(res.data.message)
    }
    else showMsg(res.msg)
  }
  const cancelEngage = async () =>{
    const res: any = await cancel(id)
    console.log(res)
    if(res?.data) {
      setIsparticipated(false)
      showMsg(res.data.message)
    }
    else showMsg(res.msg)
  }
  
  const toggleIsparticipated = () => {
    if (isparticipated) {
      setPop(true)
    } else {
      engage()
    }
  }

  //取消的弹窗
  const [ pop, setPop ] = useState(false)
  const closePop = (confirm: boolean) => {
    setPop(false)
    if(confirm) {
      cancelEngage()
    }
  }
  //请求
  useEffect(() => {
    const controller = new AbortController()
    
    const getActi = async () => {
      const response = await detail(id, controller.signal)
      if(response) {
        setActi(response) 
        setIsparticipated(!!response.isparticipated)
        console.log(response.isparticipated)
      }
    }
    getActi()

    return () => controller.abort()
  }, [id])
  //图片
  const mockImg = `${homeImgBase}/acti3.png`
  const showImg = useMemo(() => acti?.coverurl ? acti.coverurl : mockImg,[acti?.coverurl])

  return (
    <View className="acti-detail">
      { pop && <PopWindow type='报名活动' closePop={closePop} />}
      <View className="cover-box">
        <Image className="cover" src={showImg} />
      </View>
      <View className="intro">
        <Head type='活动介绍' applyon="acti" />
        <View className="text"><Text>活动名称：</Text><Text>{acti?.title}</Text></View>
        <View className="text"><Text>活动时间：</Text><Text>{acti?.starttime}</Text></View>
        <View className="text"><Text>{acti?.description}</Text></View>
      </View>
      <View className="acti-msg">
        <Head type='活动信息' applyon="acti" />
        <MessageContainer dataList={msgList} />
      </View>
      <RegisButton isparticipated={isparticipated} toggle={toggleIsparticipated} />
    </View>
  )
}