import { View, Text, Image } from "@tarojs/components"
import { useLoad } from '@tarojs/taro'
import { useState } from "react"
import Head from "@/pages/index/components/Head"
import MessageContainer from "@/pages/index/components/MessageContainer"
import { homeImgBase } from "@/global/assets/images/imgBases"
import { MsgType } from "@/pages/index/components/MessageContainer"
import { testMsg } from "@/pages/index/initData"

import './index.scss'

interface actiDetailType {
  imgHref: string
  name: string
  time: string
  content: string
  msgList: MsgType[]
}

export default function Detail() {
  //url参数
  const [ id, setId ] = useState('')
  useLoad((options) => {
    setId(options.id)
  })

  //TODO 请求活动详情

  const mockImg = `${homeImgBase}/acti3.png`
  const dataList: MsgType[] = testMsg
  return (
    <View>
      <Image src="" />
      <View>
        <Head type='活动介绍' applyon="acti" />
        <View><Text>活动名称：</Text><Text></Text></View>
        <View><Text>活动时间：</Text><Text></Text></View>
        <Text></Text>
      </View>
      <View>
        <Head type='活动信息' applyon="acti" />
        <MessageContainer dataList={dataList} />
      </View>
      <View><Text>立即报名</Text></View>
    </View>
  )
}