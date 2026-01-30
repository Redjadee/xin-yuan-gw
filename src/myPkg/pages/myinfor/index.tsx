/**
 * https://taroify.github.io/taroify.com/introduce/
 * https://docs.taro.zone/docs/vant/
 */

import { View, Text, Image, Switch, PageContainer, Button } from "@tarojs/components"
import TextArea from "@/global/components/Textarea"
import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import type { userInforType, myInforType, jobCategoryType } from "@/global/utils/api/usercenter/user"
import { updateuserinfo, getjobcategories } from "@/global/utils/api/usercenter/user"
import { showMsg } from "@/global/utils/common"
import { getCurrentInstance } from "@tarojs/taro"
import { AreaPicker, DatetimePicker, Cascader } from '@taroify/core'
import '@taroify/core/datetime-picker/style/index'
import '@taroify/core/area-picker/style/index'
import '@taroify/core/cascader/style/index'
import { areaList } from "@vant/area-data"
import { myImgBase } from "@/global/assets/images/imgBases"
import { fileUpload } from "@/global/utils/api/usercenter/fileupload"

import '@/global/style/form.scss'
import './index.scss'

interface popupPropsType {
  handleSetInfor: <K extends keyof myInforType>(key: K, val: myInforType[K]) => void
  K: keyof myInforType | 'place'
  pop: boolean
  closePop: () => void
  infor: myInforType
}

function PopUp({ handleSetInfor, K, pop, closePop, infor }: popupPropsType) {
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

  //生日
  const nowDate = useRef(new Date())
  const minDate = useRef(new Date(1970, 0, 1))
  const defaultDate = useMemo(() => infor.birthday !== '' ? new Date(infor.birthday) : new Date(2000, 0, 1), [infor])
  //Area
  const defaultArea = useMemo(() => infor.province !== '' && infor.city !== '' && infor.district !== '' && infor.province && infor.city && infor.district ? [infor.province, infor.city, infor.district] : ["110000", "110100", "110101"], [infor])
  //职业
  const [ jobs, setJobs ] = useState<jobCategoryType[]>([])
  useEffect(() => {
    const getJobs = async () => {
      const res = await getjobcategories()
      if(res?.data) {
        setJobs(res.data.categories)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getJobs()
  }, [])
  const fieldNames = {
    label: 'name',
    value: 'code',
    children: 'subLevelModelList'
  }

  const content = useMemo(() => {
    switch(K) {
      case 'bio': return (
        <View className="bio-page">
          <Text className="title">简介</Text>
          <TextArea
            key="bio-textarea" // Add key to force re-creation
            boxClass="bio-textarea-box"
            textareaClass="bio-textarea"
            placeHolder="请输入个人简介"
            maxlength={15}
            handleContent={handleSubmit}
            initialValue={infor.bio}
          />
        </View>
      )
      case 'birthday': return (
        <DatetimePicker type='date' onCancel={handleBack} onConfirm={handleSubmit} defaultValue={defaultDate} max={nowDate.current} min={minDate.current}>
          <DatetimePicker.Toolbar>
            <DatetimePicker.Button>取消</DatetimePicker.Button>
            <DatetimePicker.Title>选择日期</DatetimePicker.Title>
            <DatetimePicker.Button>确认</DatetimePicker.Button>
          </DatetimePicker.Toolbar>
        </DatetimePicker>
      )
      case 'profession': return (
        <>
        <Cascader 
          options={jobs}
          fieldNames={fieldNames}
          title='请选择职业'
          placeholder='请选择'
          onChange={(_val, options) => {
            handleSubmit(options[options.length - 1].children as string)
          }}
        />
        <View className="profession-height"></View>
        </>
      )
      case 'place': return (
        <AreaPicker defaultValue={defaultArea} areaList={areaList} title={'选择地区'} onConfirm={handleSubmit} onCancel={handleBack} confirmText={'确认'} cancelText={'取消'}  />
      )
    }
  }, [K])

  return(
    <PageContainer
      show={pop}
      round={true}
      onClickOverlay={handleBack}
      className="myinfor-pop-up"
    >
      {content}
    </PageContainer>
  )
}

interface inforItemType {
  label: string
  val: string
  K: keyof myInforType | 'place'
  openPop: (K: keyof myInforType | 'place') => void
  handleSetInfor: <K extends keyof myInforType>(key: K, val: myInforType[K]) => void
}

function InforItem({ label, val, K, openPop, handleSetInfor }: inforItemType) {  
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
      const changeAvatar = async () => {
        try {
          const finalURL = await fileUpload('avatar', 'original')
          if(finalURL && finalURL !== '') handleSetInfor('avatar', finalURL)
            console.log(finalURL)
        } catch (error) {
          console.error('Upload failed:', error)
        }
      }
      changeAvatar()
    } else if ( K !== 'realname' && K !== 'gender' && K !== 'major') {
      openPop(K)
    }
  }

  return (
    <View className="infor-item">
      <Text className="label">{label}</Text>
      <View className="right-box" onClick={handleClick}>
        {label === '头像' ?
          <Image className="avatar" src={finalVal} mode="aspectFill" /> :
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

  const [ pending, setPending ] = useState(false)
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
        setPending(data.pending)
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
  const handleSubmitInfo = async () => {
    const res = await updateuserinfo(infor, false, hide)
    if(res?.data) {
      showMsg(res.data.message)
      setPending(true)
    } else {
      if(res) showMsg(res.msg)
    }
  }

  return (
    <View className="my-infor">
      <PopUp closePop={closePop} handleSetInfor={handleSetInfor} K={k} pop={pop} infor={infor} />
      {labels.map((value, index) => {
        if(index <= 5) return <InforItem openPop={openPop} K={vals[index][0] as keyof myInforType} val={vals[index][1].toString()} label={value} key={`inforItem-${index}`} handleSetInfor={handleSetInfor} />
        else if (index === 6) return <InforItem openPop={openPop} K={'place'} val={place} label={value} key={`inforItem-${index}`} handleSetInfor={handleSetInfor} />
        else return <InforItem openPop={openPop} K={vals[9][0] as keyof myInforType} val={vals[9][1].toString()} label={value} key={`inforItem-${index}`} handleSetInfor={handleSetInfor} />
      })}
      <View className="hide-profile">
        <Text>隐藏个人信息</Text>
        <Switch type='switch' color='#33A2C9' onClick={toggleHide} checked={hide} />
      </View>
      <Button onClick={handleSubmitInfo} disabled={pending} className={['button myinfor-button', 'pending'].join(' ')}><Text>{pending ? '审核中，请耐心等待' : '确认'}</Text></Button>
    </View>
  )
}