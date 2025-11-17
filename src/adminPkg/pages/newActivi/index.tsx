import { View, Text, Image, RadioGroup, Radio, Input, Switch, PageContainer } from "@tarojs/components"
import TextArea from "@/global/components/Textarea"
import { DatetimePicker } from '@taroify/core'
import '@taroify/core/datetime-picker/style/index'
import { useState, useRef, useMemo } from "react"

import './index.scss'
import '@/global/style/form.scss'

export default function NewActivi() {
  const [ title, setTitle ] = useState('')
  const [ attenders, setAttenders ] = useState('')
  
  //活动时间
  const [ pop, setPop ] = useState(false)
  const openPop = () => setPop(true)
  const handleBack = () => setPop(false)
  const nowDate = useRef(new Date())
  const minDate = useRef(new Date(1970, 0, 1))
  const defaultDate = useMemo(() => new Date(2000, 0, 1), [])
  const [ dateType, setDateType ] = useState<'date' | 'hour-minute'>('date')
  const [ times, setTimes ] = useState({
    from: {
      date: '',
      time: ''
    },
    to: {
      date: '',
      time: ''
    }
  })
  const displayTimes = useMemo(() => {
    if(times.from.date !== '') return `${times.from.date} ${times.from.time} —— ${times.to.date} ${times.to.time}`
    else return ''
  }, [times])
  const [ timesType, setTimesType ] = useState<'from' | 'to'>('from')
  const updateTime = (type: 'from' | 'to', field: 'date' | 'time', value: string) => {
    setTimes(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }))
  }
  const handleSubmit = (d: Date) => {
    if(dateType === 'date') {
      const formatDate = (d: Date) => {
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      updateTime(timesType, 'date', formatDate(d))
      setDateType('hour-minute')
    } else if(dateType === 'hour-minute') {
      const formatTimeToHHmm = (date: Date): string => {
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${hours}:${minutes}`
      }
      updateTime(timesType, 'time', formatTimeToHHmm(d))
      setTimesType('to')
      if(timesType === 'from') setDateType('date')
      else {
        handleBack()
        setDateType('date')
        setTimesType('from')
      }
    }
  }

  //活动简介
  const [ bio, setBio ] = useState('')
  const handleContent = (newVal: string) => setBio(newVal)
  //是否在首页展示
  const [ showActi, setShowActi ] = useState(false)
  const toggleShow = () => setShowActi(!showActi)

  return (
    <View className="new-acti">
      <View className="header">
        <Image src="" className="cover" />
        <RadioGroup className="radio-group">
          <Radio color="#018BBC">直播</Radio>
          <Radio color="#018BBC">线下</Radio>
        </RadioGroup>
      </View>
      <Input value={title} onInput={e => setTitle(e.detail.value)} placeholder="添加活动标题" placeholderClass='inputPH' className='input' />
      <Input value={attenders} onInput={e => setAttenders(e.detail.value)} type='number' placeholder="请输入活动人数" placeholderClass='inputPH' className='input' />
      <Input value={displayTimes} onClick={openPop} placeholder="选择活动时间" placeholderClass='inputPH' className='input' />
      <TextArea maxlength={300} placeHolder="活动简介" handleContent={handleContent} />
      <View className="footer">
        <View className="box"><Text>存草稿</Text></View>
        <View className="box blue"><Text>去发布</Text></View>
      </View>
      <View className="show-in-home">
        <Text>在首页展示活动</Text>
        <Switch type='switch' color='#33A2C9' onClick={toggleShow} checked={showActi} />
      </View>
      <PageContainer 
      show={pop}
      round={true}
      onClickOverlay={handleBack}>
        <DatetimePicker type={dateType} onCancel={handleBack} onConfirm={handleSubmit} defaultValue={defaultDate} max={nowDate.current} min={minDate.current}>
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