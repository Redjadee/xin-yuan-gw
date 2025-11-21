import { View, PageContainer, Text } from "@tarojs/components"
import AdminButton from "../AdminButton"
import { ITouchEvent } from "@tarojs/components"
import TextArea from "@/global/components/Textarea"

import './index.scss'
import { useState } from "react"

interface propsType {
  handleReject: (reason: string) => void
  handleApprove: (event: ITouchEvent) => void
  isALL?: boolean
}

export default function PassReject({ handleReject: externalReject, handleApprove, isALL }: propsType) {
  const [ pop, setPop ] = useState(false)
  const [ reason, setReason ] = useState('')

  const handleBack = () => {
    setPop(false)
    setShow(true)
  }
  
  const getReason = (val: string) => setReason(val) 

  const [ show, setShow ] = useState(true)
  const handleReject = () => {
    setPop(true)
    setShow(false)
  }

  const handleSubmit = () => externalReject(reason)

  return (
    <>
    <PageContainer
    show={pop}
    round={true}
    >
    <View className="bio-page-pass-reject">
        <View className="title-box">
          <Text onClick={handleBack}>取消</Text>
          <Text className="title">驳回原因</Text>
          <Text className="blue" onClick={handleSubmit}>确认</Text>
        </View>
        <TextArea
          key="reason-textarea"
          boxClass="bio-textarea-box"
          textareaClass="bio-textarea"
          placeHolder="请填写原因"
          maxlength={300}
          handleContent={getReason}
        />
      </View>
    </PageContainer>

    { show && <View className="PassReject-box">
      <AdminButton label={isALL ? '全部拒绝' : '拒绝'} onClick={handleReject} />
      <AdminButton label={isALL ? '全部通过' : '通过'} onClick={handleApprove} />
    </View>}
    </>
  )
}