import { View } from "@tarojs/components"
import { useLoad } from "@tarojs/taro"
import Taro from "@tarojs/taro"
import { useEffect, useMemo, useState, useCallback } from "react"
import SettingItem from "@/global/components/SettingItem"
import { getuserinfo, updateuserinfo, getnotificationsettings, updatenotificationsettings } from "@/global/utils/api/usercenter/user"
import { notifiSettingType } from "@/global/utils/api/usercenter/user"

import './index.scss'
import { showMsg } from "@/global/utils/common"

type settingType = notifiSettingType & { hideprofile: boolean }
type settingLabelType = '' | '通知设置' | '隐私设置' | '账号安全'

export default function Settingdetail() {
  //label & title
  const [ label, setLabel ] = useState<settingLabelType>('')
  useLoad(options => {
    setLabel(() => options.label)
    Taro.setNavigationBarTitle({ title: options.label })
  })
  
  //data
  const [ statuses, setStatuses ] = useState<settingType>({
    wechatnotificationenabled: 1,
    notificationtiming: 1,
    hideprofile: false,
    showphone: 4
  })
  const handleSetStatuses = useCallback(<K extends keyof settingType>(
    key: K, val: settingType[K]
  ) => {
    setStatuses(prev => ({
      ...prev,
      [key]: val
    }))
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    const getHide = async () => {
      const res = await getuserinfo('0', controller.signal)
      if(res?.data) {
        const { hideprofile } = res.data.userinfo
        handleSetStatuses('hideprofile', hideprofile)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    const getNotifi = async () => {
      const res = await getnotificationsettings(controller.signal)
      if(res?.data) {
        const { notificationtiming, showphone, wechatnotificationenabled } = res.data
        handleSetStatuses('notificationtiming', notificationtiming)
        handleSetStatuses('showphone', showphone)
        handleSetStatuses('wechatnotificationenabled', wechatnotificationenabled)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getHide()
    getNotifi()

    return () => controller.abort()
  }, [])

  //processing
  //通知
  const getNotify = useMemo(() => statuses.wechatnotificationenabled === 1, [statuses.wechatnotificationenabled])
  const toggleNotify = useCallback(() => {
    handleSetStatuses('wechatnotificationenabled', statuses.wechatnotificationenabled === 0 ? 1 : 0)
  }, [statuses.wechatnotificationenabled])
    const toggleTiming = (num: 1 | 3) => {
    // If the currently selected timing is the same as the one being toggled, turn off timing
    if (statuses.notificationtiming === num) {
      handleSetStatuses('notificationtiming', 2) // Off state
    } else {
      // Otherwise, set to the new timing
      handleSetStatuses('notificationtiming', num)
    }
  } 
  //手机号微信号分享
  const shareInit = useMemo(() => {
    switch(statuses.showphone) {
      case 0: return [false, false, false]
      case 1: return [false, false, true]
      case 2: return [false, true, false]
      case 3: return [false, true, true]
      case 4: return [true, true, true]
    }
  }, [statuses.showphone])
  const [share, setShare] = useState(shareInit)
  const setCheckedValue = (index: number, value: boolean) => {
    setShare(prev => {
      const newShare = prev.map((v, i) => (i === index ? value : v))

      // If both share[1] and share[2] are true, set share[0] to true
      if (newShare[1] && newShare[2]) {
        newShare[0] = true
      }

      return newShare
    })
  }

  //submit
  useEffect(() => {
    const controller = new AbortController()

    const updateHide = async () => {
      const res = await updateuserinfo(null, true, statuses.hideprofile, controller.signal)
      if(res?.data) {}
      else {
        if(res) showMsg(res.msg)
      }
    }
    updateHide()

    return () => controller.abort()
  }, [statuses.hideprofile])
  useEffect(() => {
    const controller = new AbortController()
    const { notificationtiming, wechatnotificationenabled } = statuses
    //reverse logic: transform boolean array back to integer for showphone
    const [a, b, c] = share
    const handleShowphone = () => {
      if (!a && !b && !c) {
        return 0
      } else if (!a && !b && c) {
        return 1
      } else if (!a && b && !c) {
        return 2
      } else if (!a && b && c) {
        return 3
      } else if (a && b && c) {
        return 4
      } else {
        return statuses.showphone
      }
    }
    const showphone: 1 | 2 | 3 | 4 | 0 = handleShowphone()

    const updateNotify = async () => {
      const res = await updatenotificationsettings({ notificationtiming, showphone, wechatnotificationenabled })
      if(res?.data) {}
      else {
        if(res) showMsg(res.msg)
      }
    }
    updateNotify()

    return () => controller.abort()
  }, [statuses.notificationtiming, statuses.wechatnotificationenabled, share])

  const content = useMemo(() => {
    if(label !== '') {
      switch(label) {
        case '通知设置': return (
          <>
          <SettingItem content="接收通知" isChecked={getNotify} onToggle={toggleNotify} className={getNotify ? '' : 'no-border'} />
          {getNotify && <SettingItem content="提前三天通知活动" onToggle={() => toggleTiming(3)} isChecked={statuses.notificationtiming === 3} />}
          {getNotify && <SettingItem content="提前一天通知活动" onToggle={() => toggleTiming(1)} isChecked={statuses.notificationtiming === 1} className="no-border" />}
          </>
        )
        case '隐私设置': return (
          <>
          <SettingItem content="隐藏个人信息" isChecked={statuses.hideprofile} onToggle={() => handleSetStatuses('hideprofile', !statuses.hideprofile)} />
          <SettingItem content="打招呼同时分享微信号和手机号" onToggle={() => setCheckedValue(0, !share[0])} isChecked={share[0]} className={share[0] ? '' : 'no-border'} />
          {!share[0] && <SettingItem content="交换联系方式选择手机号" onToggle={() => setCheckedValue(1, !share[1])} isChecked={share[1]} />}
          {!share[0] && <SettingItem content="交换联系方式选择微信号" onToggle={() => setCheckedValue(2, !share[2])} isChecked={share[2]} className="no-border" />}
          </>
        )
        case '账号安全': {
          const toRenew = () => Taro.navigateTo({ url: '/loginPkg/pages/reset/index?type=1' })
          const toUpdatePhone = () => Taro.navigateTo({ url: '/loginPkg/pages/forgot/index?type=3' })
          return (
            <>
            <SettingItem content="重置密码" arrow={true} onClick={toRenew} />
            <SettingItem content="更换手机号" arrow={true} className="no-border" onClick={toUpdatePhone} />
            </>
          )
        }
      }
    }
  }, [label, getNotify, statuses.notificationtiming, share, statuses.hideprofile])
  return (
    <View className="setting-detail">
      {content}
    </View>
  )
}