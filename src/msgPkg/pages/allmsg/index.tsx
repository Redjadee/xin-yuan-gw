import { View } from "@tarojs/components"
import { useEffect, useState } from "react"
import MessageContainer from "@/pages/index/components/MessageContainer"
import VoidHint from "@/global/components/VoidHint"
import { messageList } from "@/global/utils/api/usercenter/message"
import { showMsg } from "@/global/utils/common"
import type { MsgShowType } from "@/pages/index/components/MessageContainer"

import './index.scss'

export default function Allmsg() {
  const [ msgs, setMsgs ] = useState<MsgShowType[]>()
  
  useEffect(() => {
    const controller = new AbortController()

    const getMsgs = async () => {
      const res = await messageList(controller.signal)
      if(res?.data) {
        setMsgs(res.data.messages)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getMsgs()

    return () => controller.abort()
  }, [])
  
  return (
    <View>
      {msgs && msgs.length != 0 ? <MessageContainer dataList={msgs} /> : <VoidHint type='消息列表' />}
    </View>
  )
}