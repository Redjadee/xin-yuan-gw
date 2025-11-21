import { View, Text, Radio, RadioGroup, Input, Button } from "@tarojs/components"
import TextArea from "@/global/components/Textarea"
import { useState } from "react"
import { messageBroadcast } from "@/global/utils/api/usercenter/admin/message"
import { showMsg } from "@/global/utils/common"
import Taro from "@tarojs/taro"

import './index.scss'
import '@/global/style/form.scss'

export default function NewNotification() {
  // 推送目标：首页 or 客户端消息
  const [target, setTarget] = useState<'home' | 'client'>('home')

  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  })

  // 通用字段更新函数
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 处理目标切换
  const handleTargetChange = (newTarget: 'home' | 'client') => {
    setTarget(newTarget)
  }

  // 发布通知
  const handleSubmit = async () => {
    if(!formData.title) {
      showMsg('请输入通知标题')
      return
    }
    if(!formData.content) {
      showMsg('请输入通知内容')
      return
    }

    const res = await messageBroadcast(formData.content, formData.title)
    if(res?.data) {
      showMsg(res.data.message)
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } else {
      if(res) showMsg(res.msg)
    }
  }

  return (
    <View className="new-notification">
      <View className="header">
        <Text>推送至</Text>
        <RadioGroup className="radio-group">
          <Radio
            checked={target === 'home'}
            color="#018BBC"
            onClick={() => handleTargetChange('home')}
          >首页</Radio>
          <Radio
            checked={target === 'client'}
            color="#018BBC"
            onClick={() => handleTargetChange('client')}
          >客户端消息</Radio>
        </RadioGroup>
      </View>
      <Input
        value={formData.title}
        onInput={e => updateField('title', e.detail.value)}
        placeholder="添加通知标题"
        placeholderClass='inputPH'
        className='input'
      />
      <TextArea
        placeHolder="通知详情"
        maxlength={300}
        handleContent={val => updateField('content', val)}
      />
      <Button className="button bottom-button" onClick={handleSubmit}><Text>发布通知</Text></Button>
    </View>
  )
}