import { useEffect, useState } from "react"
import Taro from "@tarojs/taro"
import { useLoad } from "@tarojs/taro"
import { adminsList } from "@/global/utils/api/usercenter/admin/permission"
import type { adminUserType } from "@/global/utils/api/usercenter/admin/permission"
import { showMsg } from "@/global/utils/common"
import Layout from "@/adminPkg/components/Layout"
import SettingItem from "@/global/components/SettingItem"


import './index.scss'

export default function AdminSetting() {
  const [label, setLabel] = useState('')
  useLoad(options => {
    setLabel(() => options.label)
    Taro.setNavigationBarTitle({ title: options.label })
  })

  //管理员账号管理
  const [ admins, setAdmins ] = useState<adminUserType[]>([])
  
  useEffect(() => {
    const controller = new AbortController()

    if(label === '管理员账号管理') {
      const getAdmins = async () => {
      const res = await adminsList(controller.signal)
        if(res?.data) {
          setAdmins(res.data.users)
        } else {
          if(res) showMsg(res.msg)
        }
      }
      getAdmins()
    }

    return () => controller.abort()
  }, [label])

  const ToAdminManage = (idx: number) => Taro.navigateTo({ url: `/adminPkg/pages/adminManage/index?id=${admins[idx].id}&name=${admins[idx].name}` })
  const toNewAdmin = () => Taro.navigateTo({ url: '/adminPkg/pages/adminManage/index' })

  if(label === '管理员账号管理') {
    return (
      <Layout label="新增管理员" onClick={toNewAdmin}>
        {admins.map((val, idx) => <SettingItem onClick={() => ToAdminManage(idx)} content={val.name} arrow={true} rightLabel={val.rolenames.join(' ')} key={`admin-setting-item-${idx}`} />)}
      </Layout>    
    )
  }
}