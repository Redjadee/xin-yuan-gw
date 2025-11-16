import { View, Text } from "@tarojs/components" 
import SettingItem from "@/global/components/SettingItem"
import AdminButton from "@/adminPkg/components/AdminButton"
import { useEffect, useMemo, useState } from "react"
import Taro, { useLoad } from "@tarojs/taro"
import { dataOverview, reportDownload } from "@/global/utils/api/usercenter/admin/data"
import type { dataOverviewType } from "@/global/utils/api/usercenter/admin/data"
import { showMsg } from "@/global/utils/common"
import { useDispatch } from "react-redux"
import { logout } from "@/store/authSlice"
import { setTabBar } from "@/store/tabBarSlice"

import './index.scss'

function DataOverview() {
  const labels = ['校友总量', '7日活跃率', '活动总量']
  const [nums, setNums] = useState<dataOverviewType>({
    activitotalcount: 110, //活动总数
    averageacitivityparticipatepercentage: 110, //平均活动参与百分比
    lastsevendayactivepercentage: 110, //最近7天活跃百分比
    todayincreasepercentage: 110, //今日新增百分比
    totalusercount: 110 //校友总数
  })
  useEffect(() => {
    const controller = new AbortController()
    
    const getNums = async () => {
      const res = await dataOverview()
      if(res?.data) {
        setNums(res.data)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getNums()

    return () => controller.abort()
  }, [])

  const intro = useMemo(() => [
    `今日新增${nums.todayincreasepercentage}%`,
    '数据详情见下载报表',
    `平均报名率${nums.averageacitivityparticipatepercentage}%`
  ], [nums])
  const showNums = useMemo(() => [nums.totalusercount, nums.lastsevendayactivepercentage, nums.activitotalcount], [nums])
  const Numsdecorate = ['人', '%', '']

  //下载报表
  const downloadReport = async () => {
    //new Date().toISOString().split('T')[0]
    const res = await reportDownload('2025-11-16')
    if(res?.data) {
      Taro.downloadFile({
        url: res.data.downloadurl,        
        success: res => {
          const filePath = res.tempFilePath
          Taro.openDocument({
            filePath,
            success: () => console.log("打开报表成功")
          })
        }
      })
    } else {
      if(res) showMsg(res.msg)
    }
  }

  return (
    <View className="data-overview">
      <View className="header">
        <Text>数据总览</Text>
        {<View className="download" onClick={downloadReport}><Text>下载报表</Text></View>}
      </View>
      <View className="nums-outside-box">
      {labels.map((val, idx) => (
        <View className="nums-box">
          <Text className="title"  key={`data-overview-${idx}`}>{val}</Text>
          <View className="nums-wrapper">
            <Text>{showNums[idx]}</Text>
            <Text className="decorate">{Numsdecorate[idx]}</Text>
          </View>
          <Text className={["intro", idx===1 && 'intro-grey'].join(' ')}>{intro[idx]}</Text>
        </View>
      ))}
      </View>
    </View>
  )
}


const chief = ['学生名单导入', '组织设置', '管理员账号管理'] //+ operator + auditor
const operator = ['活动设置', '通知发布'] //+ auditor
const dataAnalysis = ['查看数据报表', '导出数据报表']
const auditor = ['身份认证审核']

export default function AdminHome() {
  const [adminIdxs, setAdminIdxs] = useState<number[] | null>(null)
  useLoad(opt => {
    const parsedData = JSON.parse(opt.data)
    setAdminIdxs(parsedData)
  })

  const labels = useMemo(() => {
    let returnArr: string[] = []
    if (adminIdxs?.includes(1)) {
      returnArr = returnArr.concat([ ...chief, ...operator, ...auditor ])
    } else if (adminIdxs?.includes(2)) {
      returnArr = returnArr.concat([ ...operator, ...auditor ])
    } else if (adminIdxs?.includes(3)) {
      returnArr = returnArr.concat(dataAnalysis)
    } else if (adminIdxs?.includes(4)) {
      returnArr = returnArr.concat(auditor)
    }
    return returnArr
  }, [adminIdxs])

  const handleRouter = (label: string) => {
    switch(label) {
      case '活动设置': Taro.navigateTo({ url: '/activityPkg/pages/allview/index?type=2' }); break;
      case '通知发布': Taro.navigateTo({ url: '' }); break;
      case '学生名单导入': Taro.navigateTo({ url: '' }); break;
      case '组织设置': Taro.navigateTo({ url: '' }); break;
      case '身份认证审核': Taro.navigateTo({ url: '' }); break;
      case '管理员账号管理': Taro.navigateTo({ url: '/adminPkg/pages/setting/index?label=管理员账号管理' }); break;
    }
  }


  //退出登录
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
    dispatch(setTabBar(1))
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }

  return (
    <View className="admin-home">
      <View className="overview-box">
        <DataOverview />
      </View>
      <View className="items-box">
        {labels.map((val, idx) => <SettingItem onClick={() => handleRouter(val)} content={val} arrow={true} key={`admin-home-settingItem-${idx}`} />)}
      </View>
      <AdminButton onClick={handleLogout} label="退出登录" />
    </View>
  )
}