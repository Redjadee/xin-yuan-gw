import { View, Text, Image, Switch } from "@tarojs/components"
import { useState, useMemo, useCallback, useEffect } from "react"
import type { userInforType } from "@/global/utils/api/usercenter/user"
import { updateuserinfo } from "@/global/utils/api/usercenter/user"
import { showMsg } from "@/global/utils/common"
import { getCurrentInstance } from "@tarojs/taro"

import { myImgBase } from "@/global/assets/images/imgBases"
import './index.scss'

export type myInforType = {
  avatar: string,
  realname: string,
  bio: string,
  gender: '0' | '1' | '2',
  birthday: string,
  profession: string,
  place: string
  major: string,
}
function adjustTypeHandler(data: userInforType): myInforType {
  return {
    avatar: data.avatar,
    realname: data.realname,
    bio: data.bio,
    gender: data.gender,
    birthday: data.birthday,
    profession: data.profession ? data.profession : '选择职业',
    place: '选择地区', //FIXME
    major: data.major ? data.major : '',
  }
}

interface inforItemType {
  label: string
  val: string
  K: string
  handleSetInfor: <K extends keyof myInforType>(key: K, val: myInforType[K]) => void
}

//TODO 
// 修改实现
// 提交实现

function InforItem({ label, val, K, handleSetInfor }: inforItemType) {  

  const finalVal = useMemo(() => {
    if(K === 'gender') {
      /* 幽默js自动类型转换把'0' '1' '2' 直接转成了 number 类型的 0 1 2，然后还要报类型错误。直接 workaround 了 */
      switch(val) {
        // @ts-ignore
        case 0: return ''
        // @ts-ignore
        case 1: return '男'
        // @ts-ignore
        case 2: return '女'
      }
    }
    if(K === 'avatar') {
      return val === '' ? `${myImgBase}/defaultMyProfile.png` : val
    } else return val
  }, [val])

  return (
    <View className="infor-item">
      <Text className="label">{label}</Text>
      <View className="right-box">
        {label === '头像' ?
          <Image className="avatar" src={finalVal} /> :
          <Text>{finalVal}</Text>}
        { !(label === '头像' || label === '姓名') && <Image className="arrow" src={`${myImgBase}/itemArrow.png`} />}
      </View>
    </View>
  )
}

export default function Myinfor() {
  const labels = ['头像', '姓名', '简介', '性别', '生日', '职业', '地区', '专业']
  
  const [ infor, setInfor ] = useState<myInforType>({
    avatar: '',
    realname: '',
    bio: '',
    gender: '0',
    birthday: '选择生日',
    profession: '选择职业',
    place: '选择地区',
    major: '',
  })
  const [ hide, setHide ] = useState(false)
  const handleSetInfor = useCallback(<K extends keyof myInforType>(
    key: K, val: myInforType[K]
  ) => {
    setInfor(prev => ({
      ...prev,
      [key]: val
    }))
  }, [])
  
  useEffect(() => {
    const instance = getCurrentInstance()
    const eventChannel = instance.page && typeof instance.page.getOpenerEventChannel === 'function'
      ? instance.page.getOpenerEventChannel() : undefined

    if(eventChannel) {
      eventChannel.on('acceptUserinfor', data => {
        setInfor(adjustTypeHandler(data))
        setHide(data.hideprofile)
      } )
    }

    return () => {
      if(eventChannel) eventChannel.off('acceptUserinfor')
    }
  }, [])

  const vals = useMemo(() => Object.entries(infor), [infor])

  //submit
  const handleSubmit = async () => {
    const res = await updateuserinfo(infor, true, hide)
    if(res?.data) {
      showMsg('修改成功')
    } else {
      if(res) showMsg(res.msg)
    }
  }
  
  return (
    <View className="my-infor">
      {labels.map((value, index) => <InforItem handleSetInfor={handleSetInfor} K={vals[index][0]} val={vals[index][1]} label={value} key={`inforItem-${index}`} />)}
      <View className="hide-profile">
        <Text>隐藏个人信息</Text>
        <Switch type='switch' color='#33A2C9' onClick={() => setHide(!hide)} checked={hide} />
      </View>
    </View>
  )
}