import { View, Text, Image, PageContainer, Input } from "@tarojs/components"
import { useState, useEffect, useMemo } from 'react'
import { useLoad } from '@tarojs/taro'
import { dateFormater, showMsg } from "@/global/utils/common"
import { conversation, isexchanged, sendContact } from "@/global/utils/api/usercenter/message"
import { getlastnumber } from "@/global/utils/api/usercenter/user"
import { isPhone } from "@/global/utils/validate"

import './index.scss'

interface popupType {
  pop: boolean
  handleBack: () => void
  toId: string
  getcontact: boolean
  handleRefresh: () => void
}
function Popup({ pop, handleBack, toId, getcontact, handleRefresh }: popupType) {
  const [ show, setShow ] = useState(false)
  const [ lastPhone, setLastPhone ] = useState('')
  const [ exist, setExist ] = useState(false)
  useEffect(() => {
    const controller = new AbortController()

    const getContact = async () => {
      const res = await getlastnumber(controller.signal)
      if(res?.data) {
        const { phone } = res.data
        if(phone && phone !== '') {
          setLastPhone(() => phone)
          setShow(true)
          setExist(true)
        }
      } else {
        if(res) showMsg(res.msg)
      }
    }
    if(getcontact) getContact()

    return () => controller.abort()
  }, [getcontact])
  
  const [ phone, setPhone ] = useState('')
  const handleInput = (e: any) => {
    setPhone(e.detail.value)
    setShow(false)
  }
  const handleBlur = () => {
    if(lastPhone && lastPhone !== '') setShow(true)
    if(phone !== '') setExist(true)
  }

  const handleSend = async (type: 'new' | 'previous') => {
    if(!exist) return
    
    const sendPhone = type === 'new' ? phone : lastPhone
    if(sendPhone === '') {
      showMsg('请输入手机号')
      return
    } else if(!isPhone(sendPhone)) {
      showMsg('手机号不合法，请重新输入')
      return
    }

    const res = await sendContact(sendPhone, toId)
    if(res?.data) {
      showMsg(res.data.message)
    } else {
      if(res) showMsg(res.msg)
    }

    handleBack()
    handleRefresh()
  }

  return (
    <PageContainer
      show={pop}
      round={true}
      overlay={false}
      className="chat-pop-up"
    >
      <View className="exchange-box">
        <View className="yes-box">
          <View onClick={() => handleSend('new')} className={["yes", show && 'border'].join(' ')}><Text>交换手机号：</Text><Input maxlength={11} value={phone} onInput={handleInput} onBlur={handleBlur} placeholderClass="yes-ph" placeholder="请输入..."  /></View>
          { show && <View onClick={() => handleSend('previous')} className="yes below"><Text>使用上次输入：{lastPhone}</Text></View>}
        </View>
        <View onClick={handleBack} className="no"><Text>暂不交换</Text></View>
      </View>
    </PageContainer>
  )
}

/* ----- */
export interface MessageItem {
  createdat: string
  id: string
  itemkey: string
  itemvalue: string
  messageid: string
  updatedat: string
}
interface conversationType {
  content: string
  contenttype?: 1 | 2 | 3 | 4 | 5 //内容类型: 1-文本 2-图片 3-语音 4-视频 5-文件
  
  fromuseravatar?: string //头像图片链接
  fromusername?: string
  fromuserid?: string //发送者用户ID

  isread?: 0 | 1 //0-未读 1-已读
  createdat: string

  messageitems?: MessageItem[]
}

function Notification({val}) { //TODO
  return (
    <View className="notifi-bg">
      <Text className="notifi">{val}</Text>
    </View>
  )
}

/* ----- */
function Time({val}) {
  return (<Text className="notifi">{dateFormater(val)}</Text>)
}
interface chatBubblePropsType {
  type: 'left' | 'right'
  avatar: string
  content: string
}
function Bubble({ type, content, avatar }: chatBubblePropsType) {
  if(type === 'left') {
    return (
      <View className="chat-bubble left">
        <Image className="profile" src={avatar} />
        <View className="bubble">
          <Text>{content}</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View className="chat-bubble right">
        <View className="bubble">
          <Text>{content}</Text>
        </View>
        <Image className="profile" src={avatar} />
      </View>
    )
  }
}

function ChatChild(val: conversationType) {
  const type = useMemo(() => {
    if(!val.messageitems) return 'left'
    const key = val.messageitems.filter((val) => val.itemkey === 'show_direction')
    if(key[0].itemvalue === 'send') return 'right'
    else return 'left'
  }, [val])
  return (
    <>
      <Time val={val.createdat}  />
      <Bubble type={type} content={val.content} avatar={val.fromuseravatar || ''} />
    </>
  )
}

/* ----- */
/**
 * 聊天页面
 *
 * URL 参数说明：
 * @param id - 对方的 ID（用户ID 或 组织ID）
 * @param type - 聊天类型（'个人' 或 '组织'）
 * @param title - 聊天对象的名称（用于显示标题）
 */
export default function Chat() {
  const [ from, setFrom ] = useState({ id: '', type: '', title: ''})
  const [ fromChanged, setFromChanged ] = useState(false)
  useLoad(options => {
    setFrom({id: options.id, type: options.type, title: options.title })
    setFromChanged(true)
  })

  const [ list, setList ] = useState<conversationType[]>([])
  const [ refresh, setRefresh ] = useState(false)
  const handleRefresh = () => setRefresh(!refresh)
  useEffect(() => {
    const controller = new AbortController()

    const getContent = async () => {
      const res = await conversation(from.id, from.type as 'personal' | 'activity' | 'broadcast', controller.signal)
      if(res?.data) {
        setList(res.data.messages)
        console.log(res.data)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    if(fromChanged) getContent()

    return () => controller.abort()
  }, [fromChanged, refresh])

  const [ pop, setPop ] = useState(false)
  const closePop = () => setPop(false)
  useEffect(() => {
    const controller = new AbortController()

    const getExchanged = async () => {
      console.log('id: ', from.id)
      const res = await isexchanged(controller.signal, from.id)
      if(res?.data) {
        const { exchanged } = res.data
        if(!exchanged) setPop(() => true)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    if(fromChanged && from.type === 'personal') getExchanged()

    return () => controller.abort()
  }, [fromChanged, from])

  const getcontact = useMemo(() => from.type === 'personal', [from])
  return (
    <View className="chat">
      <Text className="title">{from.title}</Text>
      {[...list].reverse().map((val, index) => <ChatChild {...val} key={`chatChild-${list.length - 1 - index}`} />)}
      <Popup handleRefresh={handleRefresh} getcontact={getcontact} pop={pop} handleBack={closePop} toId={from.id} />
    </View>
  )
}