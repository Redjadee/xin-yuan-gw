/**
 * https://taroify.github.io/taroify.com/introduce/
 * https://docs.taro.zone/docs/vant/
 */

import { View, Text, Image, Switch, PageContainer } from "@tarojs/components"
import TextArea from "@/global/components/Textarea"
import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import type { userInforType, myInforType } from "@/global/utils/api/usercenter/user"
import { updateuserinfo } from "@/global/utils/api/usercenter/user"
import { showMsg } from "@/global/utils/common"
import { getCurrentInstance } from "@tarojs/taro"
import Taro from "@tarojs/taro"
import { AreaPicker, DatetimePicker } from '@taroify/core'
import '@taroify/core/datetime-picker/style/index'
import '@taroify/core/area-picker/style/index'
import { areaList } from "@vant/area-data"
import { myImgBase } from "@/global/assets/images/imgBases"
import { fileUpload } from "@/global/utils/api/usercenter/fileupload"

import './index.scss'

interface popupPropsType {
  handleSetInfor: <K extends keyof myInforType>(key: K, val: myInforType[K]) => void
  K: keyof myInforType | 'place'
  pop: boolean
  closePop: () => void
}

function PopUp({ handleSetInfor, K, pop, closePop }: popupPropsType) {
  const handleBack = () => closePop()
  const handleSubmit = (val: Date | string[] | string) => {
    handleBack()
    switch(K) {
      case 'bio': {
        if (typeof val === 'string') handleSetInfor('bio', val)
      }; break;
      case 'birthday': {
        const formatDate = (d: Date) => {
          const year = d.getFullYear()
          const month = String(d.getMonth() + 1).padStart(2, '0')
          const day = String(d.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        }
        if(val instanceof Date) handleSetInfor('birthday', formatDate(val))
      }; break;
      case 'profession': {
        if (typeof val === 'string') handleSetInfor('profession', val)
      }; break;
      case 'place': {
        if (Array.isArray(val)) {
          handleSetInfor('province', areaList.province_list[val[0]])
          handleSetInfor('city', areaList.city_list[val[1]])
          handleSetInfor('district', areaList.county_list[val[2]])
        }
      }; break;
      case 'major': {
        if (typeof val === 'string') handleSetInfor('major', val)
      }; break;
    }
  }

  const [ keyboardHeight, setKeyboardHeight ] = useState(0)

  useEffect(() => {
    if (K === 'bio' && pop) {
      Taro.onKeyboardHeightChange(res => setKeyboardHeight(res.height))
      return () => {
        Taro.offKeyboardHeightChange()
      }
    }
  }, [K, pop])
  const dynamicHeight = useMemo(() => { return { height: keyboardHeight } }, [keyboardHeight])
  //生日
  const nowDate = useRef(new Date())
  const minDate = useRef(new Date(1970, 0, 1))
  //
  const content = useMemo(() => {
    switch(K) {
      case 'bio': return (
        <View className="bio-page">
          <Text className="title">简介</Text>
          <TextArea
            boxClass="bio-textarea-box"
            textareaClass="bio-textarea"
            placeHolder="请输入个人简介"
            maxlength={15}
            handleContent={handleSubmit}
          />
          { keyboardHeight !== 0 && <View style={dynamicHeight} />}
        </View>
      )
      case 'birthday': return (
        <DatetimePicker type='date' onCancel={handleBack} onConfirm={handleSubmit} max={nowDate.current} min={minDate.current}>
          <DatetimePicker.Toolbar>
            <DatetimePicker.Button>取消</DatetimePicker.Button>
            <DatetimePicker.Title>选择日期</DatetimePicker.Title>
            <DatetimePicker.Button>确认</DatetimePicker.Button>
          </DatetimePicker.Toolbar>
        </DatetimePicker>
      )
      case 'profession': return (
        <View className="bio-page">
          <Text className="title">职业</Text>
          <TextArea
            boxClass="bio-textarea-box"
            textareaClass="bio-textarea"
            placeHolder="请输入您的职业"
            maxlength={15}
            handleContent={handleSubmit}
          />
          { keyboardHeight !== 0 && <View style={dynamicHeight} />}
        </View>
      )
      case 'place': return (
        <AreaPicker defaultValue={["110000", "110100", "110101"]} areaList={areaList} title={'选择地区'} onConfirm={handleSubmit} onCancel={handleBack} confirmText={'确认'} cancelText={'取消'}  />
      )
    }
  }, [K])

  return(
    <PageContainer show={pop} round={true} onClickOverlay={handleBack}>
      {content}
    </PageContainer>
  )
}

interface inforItemType {
  label: string
  val: string
  K: keyof myInforType | 'place'
  openPop: (K: keyof myInforType | 'place') => void
}

function InforItem({ label, val, K, openPop }: inforItemType) {  
  const finalVal = useMemo(() => {
    if(K === 'gender') {
      switch(val) {
        case "0": return ''
        case "1": return '男'
        case "2": return '女'
      }
    }
    if(K === 'avatar') {
      return val === '' ? `${myImgBase}/defaultMyProfile.png` : val
    } else return val
  }, [val])

  const handleClick = () => {
    if(K === 'avatar') {
      fileUpload('avatar')
    } else if ( K !== 'realname' && K !== 'gender' && K !== 'major') {
      openPop(K)
    }
  }

  return (
    <View className="infor-item">
      <Text className="label">{label}</Text>
      <View className="right-box" onClick={handleClick}>
        {label === '头像' ?
          <Image className="avatar" src={finalVal} /> :
          <Text>{finalVal}</Text>}
        { !(label === '头像' || label === '姓名' || label === '性别' || label === '专业') ? 
        <Image className="arrow" src={`${myImgBase}/itemArrow.png`} /> :
        <View style={{ width: 5 }} />
        }
      </View>
    </View>
  )
}

export default function Myinfor() {
  const labels = ['头像', '姓名', '简介', '性别', '生日', '职业', '地区', '专业']
  
  const [ infor, setInfor ] = useState<myInforType>({
    avatar: '', //头像
    realname: '',
    bio: '', //简介
    gender: 0, //性别: 0-未知 1-男 2-女
    birthday: '', //format: 2006-03-03
    profession: '',
    city: '',
    district: '',
    province: '',
    major: '',
  })

  const [ hide, setHide ] = useState(false)
  const toggleHide = () => setHide(!hide)
  const handleSetInfor = useCallback(<K extends keyof myInforType>(
    key: K, val: myInforType[K]
  ) => {
    setInfor(prev => ({
      ...prev,
      [key]: val
    }))
  }, [])
  
  const typeFormatter = (data: userInforType): myInforType => {
    return {
      avatar: data.avatar, //头像
      realname: data.realname,
      bio: data.bio, //简介
      gender: data.gender, //性别: 0-未知 1-男 2-女
      birthday: data.birthday, //format: 2006-03-03
      profession: data.profession,
      city: data.city,
      district: data.district,
      province: data.province,
      major: data.major,
    }
  }
  useEffect(() => {
    const instance = getCurrentInstance()
    const eventChannel = instance.page && typeof instance.page.getOpenerEventChannel === 'function'
      ? instance.page.getOpenerEventChannel() : undefined

    if(eventChannel) {
      eventChannel.on('acceptUserinfor', data => {
        setInfor(typeFormatter(data))
        setHide(data.hideprofile)
      } )
    }

    return () => {
      if(eventChannel) eventChannel.off('acceptUserinfor')
    }
  }, [])
  const vals = useMemo(() => Object.entries(infor), [infor])
  const place = useMemo(() => `${infor.province} ${infor.city} ${infor.district}`, [infor.province, infor.city, infor.district])

  //Popup
  const [ pop, isPop ] = useState(false)
  const [ k, setK ] = useState<keyof myInforType | 'place'>('bio')
  const openPop = (K: keyof myInforType | 'place') => {
    setK(() => K)
    isPop(true)
  }
  const closePop = () => isPop(false)

  //submit
  useEffect(() => {
    const controller = new AbortController()

    const handleSubmitInfo = async () => {
      const res = await updateuserinfo(infor, true, hide, controller.signal)
      if(res?.data) {
        showMsg(res.data.message)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    handleSubmitInfo()

    return () => controller.abort()
  }, [infor])

  return (
    <View className="my-infor">
      <PopUp closePop={closePop} handleSetInfor={handleSetInfor} K={k} pop={pop} />
      {labels.map((value, index) => {
        if(index <= 5) return <InforItem openPop={openPop} K={vals[index][0] as keyof myInforType} val={vals[index][1].toString()} label={value} key={`inforItem-${index}`} />
        else if (index === 6) return <InforItem openPop={openPop} K={'place'} val={place} label={value} key={`inforItem-${index}`} />
        else return <InforItem openPop={openPop} K={vals[9][0] as keyof myInforType} val={vals[9][1].toString()} label={value} key={`inforItem-${index}`} />
      })}
      <View className="hide-profile">
        <Text>隐藏个人信息</Text>
        <Switch type='switch' color='#33A2C9' onClick={toggleHide} checked={hide} />
      </View>
    </View>
  )
}