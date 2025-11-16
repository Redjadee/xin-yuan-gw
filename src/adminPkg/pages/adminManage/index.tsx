import { View, Text, Input, Button } from "@tarojs/components"
import { useEffect, useMemo, useState } from "react"
import SettingItem from "@/global/components/SettingItem"
import Layout from "@/adminPkg/components/Layout"
import PopWindow from "@/pages/alumnus/components/PopWindow"
import { usersRolesget, usersRoles, adminsDelete, userQuery } from "@/global/utils/api/usercenter/admin/permission"
import { useLoad } from "@tarojs/taro"
import { showMsg } from "@/global/utils/common"
import Taro from "@tarojs/taro"

import './index.scss'
import '@/global/style/form.scss'

interface propsType {
  roleIds?: number[]
  id: string
  onRoleIdsChange?: (roleId: number) => void
}

function Roles({ roleIds, id, onRoleIdsChange }: propsType) {
  const [localRoleIds, setLocalRoleIds] = useState(roleIds ? roleIds : [])
  const roleMap = [2, 3, 4]
  const checked = useMemo(() => roleMap.map(id => localRoleIds.includes(id)), [localRoleIds])
 
  useEffect(() => {
    const controller = new AbortController()

    const updateRoles = async () => {
      const res = await usersRoles(localRoleIds, id, controller.signal)
      if(res?.data) {
        showMsg(res.data.message)
      } else {
        if(res) showMsg(res.msg)
      }
    }
    if(roleIds) {
      updateRoles()
    } else if(onRoleIdsChange) {
      const lastChangedRoleId = localRoleIds[localRoleIds.length - 1]
      if(lastChangedRoleId !== undefined) {
        onRoleIdsChange(lastChangedRoleId)
      }
    }

    return () => controller.abort()
  }, [localRoleIds, roleIds, onRoleIdsChange])

  //pop window
  const [ pop, setPop ] = useState(false)
  const [ confirm, setConfirm ] = useState(false)
  const [ pendingRoleId, setPendingRoleId ] = useState<number | null>(null)

  useEffect(() => {
    if(confirm && pendingRoleId !== null) {
      setLocalRoleIds(prev =>
        prev.includes(pendingRoleId)
          ? prev.filter(id => id !== pendingRoleId)
          : [...prev, pendingRoleId]
      )
      setConfirm(false)
      setPendingRoleId(null)
    }
  }, [confirm, pendingRoleId])

  const closePop = (confirm: boolean) => {
    setPop(false)
    if(confirm) setConfirm(() => true)
  }
  const handleToggle = (roleId: number) => () => {
    setPendingRoleId(roleId)
    setPop(true)
  }

  const rolesName = ['运营管理员', '数据管理员', '审核员']
  return (
    <>
      { pop && <PopWindow type='修改账号' closePop={closePop} />}
      {rolesName.map((val, idx) => (
        <SettingItem
          content={val}
          isChecked={checked[idx]}
          onToggle={handleToggle(roleMap[idx])}
        />
      ))}
    </>
  )
}

export default function AdminManage() {
  //页面通信
  const [ from, setFrom ] = useState({ id: '', name: '' })
  const [ isNewAdmin, setIsNewAdmin ] = useState(false)
  useLoad(opt => {
    if(opt.id && opt.name) setFrom({ id: opt.id, name: opt.name })
    else {
      Taro.setNavigationBarTitle({ title: '新增管理员' })
      setIsNewAdmin(true)
    }
  })

  //http请求
  const [ roleIds, setRoleIds ] = useState<number[]>([])
  useEffect(() => {
    const controller = new AbortController()

    const getRoles = async () => {
      const res = await usersRolesget(from.id, controller.signal)
      if(res?.data) {
        const roles = res.data.roles as { id: number }[] 
        setRoleIds(() => roles.map(role => role.id))
      } else {
        if(res) showMsg(res.msg)
      }
    }
    getRoles()

    return () => controller.abort()
  }, [])
  
  //pop window
  const [ pop, setPop ] = useState(false)
  const [ popType, setPopType ] = useState<'禁用账号' | '删除账号'>('禁用账号')
  // close pop
  const closePop = async (confirm: boolean) => {
    setPop(false)
    if(confirm) {
      if(popType === '删除账号') {
        const res = await adminsDelete([from.id])
        if(res?.data) {
          showMsg(res.data.message)
        } else {
          if(res) showMsg(res.msg)
        }
      } else { //禁用账号
        setRoleIds([5])
      }
    }
  }
  // open pop
  const handleBanned = () => {
    setPop(true)
    setPopType('禁用账号')
  }
  const handleDelete = () => {
    setPop(true)
    setPopType('删除账号')
  }

  /* --- new Admin --- */
  const [ name, setName ] = useState('')
  const [ stuId, setStuId ] = useState('')

  const handleRoleIdsChange = (roleId: number) => {
    setRoleIds(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }
  
  const handleQuery = async () => {
    const res = await userQuery(name, stuId)
    if(res?.data) {
      const Res = await usersRoles(roleIds, res?.data.users[0].id)
      if(Res?.data) {
        showMsg(res.data.message)
      }
    } else {
      if(res) showMsg(res.msg)
    }
  }

  if(isNewAdmin) {
    return ( 
      <View className="new-admin">
        <View className="height-handler"></View>
        <Input placeholder="请输入姓名" value={name} onInput={e => setName(e.detail.value)} className="input" placeholderClass="inputPH" />
        <Input placeholder="请输入学号" value={stuId} onInput={e => setStuId(e.detail.value)} className="input" placeholderClass="inputPH" />
        <Roles id={from.id} onRoleIdsChange={handleRoleIdsChange} />
        <Button className="button" onClick={handleQuery}><Text>添加</Text></Button>
      </View>
    )
  } else {
    return (
      <Layout label="删除管理员" onClick={handleDelete} className="admin-manage">
        { pop && <PopWindow type={popType} closePop={closePop} />}
        <Text className="title">{from.name}</Text>
        <SettingItem content="禁用账号" onClick={handleBanned} />
        { !roleIds.includes(5) && <Roles roleIds={roleIds} id={from.id} />}
      </Layout>
    )
  }
}