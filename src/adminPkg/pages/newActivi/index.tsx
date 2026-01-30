import { View, Text, Image, RadioGroup, Radio, Input, Switch, PageContainer } from "@tarojs/components"
import TextArea from "@/global/components/Textarea"
import { DatetimePicker } from '@taroify/core'
import '@taroify/core/datetime-picker/style/index'
import { useState, useRef, useMemo } from "react"
import { create, adminDetail, update } from "@/global/utils/api/activitycenter/activity"
import { fileUpload } from "@/global/utils/api/usercenter/fileupload"
import { useLoad } from '@tarojs/taro'
import { useEffect } from "react"

import './index.scss'
import '@/global/style/form.scss'
import { showMsg } from "@/global/utils/common"

export default function NewActivi() {
  // 活动ID - 如果存在则为编辑模式，否则为创建模式
  const [id, setId] = useState('')
  useLoad((options) => {
    if(options.id) setId(options.id)
  })

  // 表单数据 - 存储活动基本信息
  const [formData, setFormData] = useState({
    coverurl: '', // 封面图片URL
    type: 2 as 2 | 3, // 活动类型: 2: 直播, 3: 线下
    title: '', // 活动标题
    maxparticipants: '', // 最大参与人数
    description: '', // 活动描述
    isfeatured: 0 as 0 | 1 // 是否在首页推荐: 0: 否, 1: 是
  })

  // 处理图片上传
  const handleUpload = async () => {
    try {
      const finalURL = await fileUpload('activity', 'original')
      if(finalURL) setFormData(prev => ({ ...prev, coverurl: finalURL }))
    } catch (err) {
      console.log('活动图片上传失败：', err)
    }
  }

  // 通用字段更新函数
  const updateField = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 活动时间选择相关状态
  const [ pop, setPop ] = useState(false) // 时间选择弹窗显示状态
  const openPop = () => setPop(true) // 打开时间选择弹窗
  const handleBack = () => setPop(false) // 关闭时间选择弹窗
  const nowDate = useRef(new Date()) // 当前日期（作为最大可选日期）
  const minDate = useRef(new Date(1970, 0, 1)) // 最小可选日期
  const defaultDate = useMemo(() => new Date(2000, 0, 1), []) // 默认日期
  const [ dateType, setDateType ] = useState<'date' | 'hour-minute'>('date') // 选择器类型: 日期 或 时间

  // 活动时间数据结构 - 分别存储开始和结束的日期和时间
  const [ times, setTimes ] = useState({
    from: {
      date: '', // 开始日期: YYYY-MM-DD
      time: '' // 开始时间: HH:mm
    },
    to: {
      date: '', // 结束日期: YYYY-MM-DD
      time: '' // 结束时间: HH:mm
    }
  })

  // 显示选中的时间范围
  const displayTimes = useMemo(() => {
    if(times.from.date !== '') return `${times.from.date} ${times.from.time} —— ${times.to.date} ${times.to.time}`
    else return ''
  }, [times])

  // 当前正在选择的时间类型: 开始时间 或 结束时间
  const [ timesType, setTimesType ] = useState<'from' | 'to'>('from')

  // 更新时间数据的函数
  const updateTime = (type: 'from' | 'to', field: 'date' | 'time', value: string) => {
    setTimes(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }))
  }
  // 处理时间选择确认
  const handleSubmitDate = (d: Date) => {
    if(dateType === 'date') {
      // 日期格式化函数: YYYY-MM-DD
      const formatDate = (d: Date) => {
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      // 更新对应的日期字段，然后切换到时间选择模式
      updateTime(timesType, 'date', formatDate(d))
      setDateType('hour-minute')
    } else if(dateType === 'hour-minute') {
      // 时间格式化函数: HH:mm (24小时制)
      const formatTimeToHHmm = (date: Date): string => {
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${hours}:${minutes}`
      }
      // 更新对应的时间字段
      updateTime(timesType, 'time', formatTimeToHHmm(d))

      // 判断下一个选择步骤
      setTimesType('to') // 下一步选择结束时间
      if(timesType === 'from') {
        // 如果刚选择了开始时间，继续选择结束日期
        setDateType('date')
      } else {
        // 如果刚选择了结束时间，关闭弹窗并重置选择器
        handleBack()
        setDateType('date')
        setTimesType('from')
      }
    }
  }

  // 切换首页推荐状态
  const toggleShow = () => updateField('isfeatured', formData.isfeatured === 0 ? 1 : 0)

  // 编辑模式下加载活动数据
  useEffect(() => {
    const controller = new AbortController()

    const loadActivity = async () => {
      if(id) {
        // 调用管理员详情接口获取活动数据
        const res = await adminDetail(id, controller.signal)
        if(res?.data) {
          const activity = res.data.activity
          // 更新表单数据
          setFormData({
            coverurl: activity.coverurl,
            type: activity.type as 2 | 3,
            title: activity.title,
            maxparticipants: activity.maxparticipants?.toString() || '',
            description: activity.description,
            isfeatured: activity.isfeatured || 0
          })

          // 解析日期时间字符串并更新时间状态
          const parseDateTime = (datetime: string) => {
            const [date, time] = datetime.split(' ')
            // 格式化时间为 HH:mm 格式
            const formattedTime = time ? time.substring(0, 5) : ''
            return { date, time: formattedTime }
          }

          setTimes({
            from: parseDateTime(activity.starttime),
            to: parseDateTime(activity.endtime)
          })
        } else {
          if(res) showMsg(res.msg)
        }
      }
    }
    loadActivity()

    // 组件卸载时取消请求
    return () => controller.abort()
  }, [id])

  // 提交表单 (创建或更新活动)
  const handleSubmit = async (status: 0 | 1) => { // status: 0-草稿, 1-发布
    // 构建提交数据
    const submitData = {
      ...formData,
      status,
      starttime: times.from.date + ' ' + times.from.time, // 组合成完整的开始时间
      endtime: times.to.date + ' ' + times.to.time,       // 组合成完整的结束时间
      maxparticipants: formData.maxparticipants ? Number(formData.maxparticipants) : undefined
    }

    let res
    if(id) {
      // 编辑模式: 调用更新接口
      res = await update(submitData, id)
    } else {
      // 创建模式: 调用创建接口
      res = await create(submitData)
    }

    // 处理响应结果
    if(res?.data) {
      showMsg(res.data.message)
    } else {
      if(res) showMsg(res.msg)
    }
  }

  return (
    <View className="new-acti">
      <View className="header">
        <Image src={formData.coverurl} className="cover" mode="aspectFill" onClick={handleUpload} />
        <RadioGroup className="radio-group">
          <Radio checked={formData.type === 2} color="#018BBC" onClick={() => updateField('type', 2)}>直播</Radio>
          <Radio checked={formData.type === 3} color="#018BBC" onClick={() => updateField('type', 3)}>线下</Radio>
        </RadioGroup>
      </View>
      <Input value={formData.title} onInput={e => updateField('title', e.detail.value)} placeholder="添加活动标题" placeholderClass='inputPH' className='input' />
      <Input value={formData.maxparticipants} onInput={e => updateField('maxparticipants', e.detail.value)} type='number' placeholder="请输入活动人数" placeholderClass='inputPH' className='input' />
      <Input value={displayTimes} onClick={openPop} placeholder="选择活动时间" placeholderClass='inputPH' className='input' />
      <TextArea maxlength={300} placeHolder="活动简介" handleContent={val => updateField('description', val)} />
      <View className="footer">
        <View className="box" onClick={() => handleSubmit(0)}><Text>存草稿</Text></View>
        <View className="box blue" onClick={() => handleSubmit(1)}><Text>去发布</Text></View>
      </View>
      <View className="show-in-home">
        <Text>在首页展示活动</Text>
        <Switch type='switch' color='#33A2C9' onClick={toggleShow} checked={formData.isfeatured === 1} />
      </View>
      <PageContainer 
      show={pop}
      round={true}
      onClickOverlay={handleBack}>
        <DatetimePicker type={dateType} onCancel={handleBack} onConfirm={handleSubmitDate} defaultValue={defaultDate} max={nowDate.current} min={minDate.current}>
          <DatetimePicker.Toolbar>
            <DatetimePicker.Button>取消</DatetimePicker.Button>
            <DatetimePicker.Title>选择日期</DatetimePicker.Title>
            <DatetimePicker.Button>确认</DatetimePicker.Button>
          </DatetimePicker.Toolbar>
        </DatetimePicker>
      </PageContainer>
    </View>
  )
}