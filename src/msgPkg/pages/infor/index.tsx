import { View, Text, Image } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import FunctionItem from '@/pages/my/components/FunctionItem'
import { getuserinfo, userInforType } from '@/global/utils/api/usercenter/user'
import { orgDetail, orginSayhiType } from '@/global/utils/api/activitycenter/org'
import { showMsg } from '@/global/utils/common'
import { useEffect, useState, useMemo } from 'react'
import { friendUnfollow, greetingSend } from '@/global/utils/api/usercenter/friend'
import { orgExit, orgJoin } from '@/global/utils/api/activitycenter/org'
import PopWindow from '@/pages/alumnus/components/PopWindow'

import { myImgBase } from '@/global/assets/images/imgBases'
import './index.scss'

/**
 * 个人/组织信息页面
 *
 * URL 参数说明：
 * @param type - 信息类型
 *   - '个人': 查看个人信息
 *   - '组织': 查看组织信息
 * @param id - 用户ID 或 组织ID
 * @param status - 关系状态（是否已关注/已加入）
 */
export default function InforPage() {
  const [type, setType] = useState<'' | '个人' | '组织'>("")
  const [id, setId] = useState("")
  const [status, setStatus] = useState<boolean>(false)
  const [ infor, setInfor ] = useState<userInforType | orginSayhiType>()
  const [showPop, setShowPop] = useState(false)
  const [forbidden, setForbidden] = useState(false)

  useLoad(options => {
    console.log(options)
    if(options.type) setType(options.type)
    if(options.id) setId(options.id)
    if(options.status) setStatus(JSON.parse(options.status))
  })

  useEffect(() => {
    const controller = new AbortController()

    const getInfor = async () => {
      const res = type === '个人' ? await getuserinfo(id, controller.signal) : await orgDetail(id, controller.signal)
      if(res?.data) {
        setInfor(type === '个人' ? res.data.userinfo : res.data.organization)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    if(type !== '') getInfor()

    return () => controller.abort()
  }, [type])

  const profileHref = useMemo(() =>
    infor && infor.avatar !== '' ? infor.avatar : `${myImgBase}/defaultMyProfile.png`, [infor])
  //@ts-ignore
  const name = useMemo(() => infor ? (type === '个人' ? infor.realname : infor.name) : '信息人', [infor, type])

  const formatId = useMemo(() => {
    if (!id || id.length <= 8) return id
    return `${id.slice(0, 4)}******${id.slice(-4)}`
  }, [id])

  const sayHi = async () => {
    if(type === '个人') {
      const res = await greetingSend(id)
      if(res?.data) {
        showMsg(res.data.message)
        setStatus(!status)
      } else {
        if(res) showMsg(res.msg)
      }
    } else {
      const res = await orgJoin(id, '')
      if(res?.data) {
        showMsg(res.data.message)
      } else {
        if(res) showMsg(res.msg)
      }
    }
  }

  const recall = async () => {
    if(type === '个人') {
      const res = await friendUnfollow(id)
      if(res?.data) {
        showMsg(res.data.message)
      } else {
        if(res) showMsg(res.msg)
      }
    } else {
      const res = await orgExit(id)
      if(res?.data) {
        showMsg(res.data.message)
      } else {
        if(res) showMsg(res.msg)
      }
    }
  }

  const handleOpen = () => {
    if (status === true) {
      setShowPop(true)
    } else {
      sayHi()
    }
  }

  const functionItemList  = useMemo(() =>
  type === '个人' ?
  [
    {
      href: `${myImgBase}/item2.png`,
      label: '加入的组织',
      url: `/myPkg/pages/contact/index?type=2&id=${id}`
    },
    {
      href: `${myImgBase}/item3.png`,
      label: '参与活动',
      url: `/activityPkg/pages/allview/index?type=3&id=${id}`
    }
  ] : [
    {
      href: `${myImgBase}/item3.png`,
      label: '相关活动',
      url: `/activityPkg/pages/allview/index?type=4&id=${id}`
    }
  ]
  , [type, id])

  const openForbidden = () => setForbidden(true)
  const closePop = async (confirm: boolean) => {
    setShowPop(false)
    if (confirm) {
      await recall()
      setStatus(false)
    }
    setForbidden(false)
  }

  return (
    <View className='infor-page'>
      {showPop && <PopWindow closePop={closePop} type={forbidden ? '不可查看' : type === '个人' ? '关注用户' : '退出组织'} />}
      <View className='head'>
        <Image src={`${myImgBase}/bgimg.png`} className='head-bgimg' />

        <View className='head-wrapper'>
          <Image src={profileHref} className={`profile ${type === '组织' ? 'org-profile' : ''}`} />
          <View className={`middle-box ${type === '组织' ? 'org-middle' : ''}`}>
            <Text className={`name ${type === '组织' ? 'org-name' : ''}`}>{name}</Text>
            <Text>编号：{formatId}</Text>
          </View>
          <View onClick={handleOpen} className={status === true ? 'button selected' : 'button'}>
            {type === '个人' ?
              <Text className='text'>{status === true ? '已关注' : '打招呼'}</Text> :
              status === true ? <Text className='text'>已加入</Text> : <Text className='text'>加入</Text>
            }
          </View>
        </View>
      </View>
      {functionItemList.map((value, index) => (
        <FunctionItem
          key={index}
          {...value}
          index={index}
          hideprofile={type === '个人' ? (infor ? (infor as userInforType).hideprofile : true) : false}
          openForbidden={openForbidden}
        />
      ))}
    </View>
  )
}
