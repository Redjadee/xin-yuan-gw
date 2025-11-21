import { View, Text, ScrollView } from '@tarojs/components'
import { useLoad, useDidShow } from '@tarojs/taro'
import { useMemo, useState, useEffect } from 'react'
import AuditItem from './components/AuditItem'
import PopWindow from '@/pages/alumnus/components/PopWindow'
import VoidHint from '@/global/components/VoidHint'
import SearchTab from '@/global/components/SearchTab'
import Taro from '@tarojs/taro'
import { showMsg } from '@/global/utils/common'
import { auditList, auditAudit } from '@/global/utils/api/usercenter/admin/audit'
import { orgList } from '@/global/utils/api/activitycenter/org'
import type { orginSayhiType, orginFilterType } from '@/global/utils/api/activitycenter/org'
import AdminButton from '@/adminPkg/components/AdminButton'
import PassReject from '@/adminPkg/components/PassReject'

import './index.scss'
import '@/pages/alumnus/index.scss'

const alumnusFilter = ['已通过', '待审核', '已拒绝']
const organizationFilter = ['推荐', '全部', '专业', '地方', '海外', '行业', '兴趣爱好']

export default function OrganizationNaudit() {
  // 页面类型：校友认证 或 组织管理
  const [ label, setLabel ] = useState<'校友' | '组织'>('组织')
  // 审核列表数据
  const [ audits, setAudits ] = useState<any[]>()
  // 审核状态：0-待审核, 1-已通过, 2-已拒绝
  const [ auditStatus, setAuditStatus ] = useState<0|1|2>(0)
  // 弹窗显示状态
  const [ pop, setPop ] = useState(false)
  // 刷新状态，用于触发数据重新加载
  const [ refresh, setRefresh ] = useState(false)
  const handleRefresh = () => setRefresh(!refresh)

  // 页面加载时获取URL参数并设置标题
  useLoad(options => {
    const urlLabel = options.label ? options.label : '组织'
    setLabel(urlLabel)
    Taro.setNavigationBarTitle({ title: urlLabel === '校友' ? '身份认证' : '组织设置' })
  })

  // 页面显示时刷新数据
  useDidShow(() => {
    if(label === '校友') {
      handleRefresh()
    }
  })

  // 根据页面类型显示不同的筛选标签
  const bodyLabels = useMemo(() => label === '校友' ? alumnusFilter : organizationFilter, [label])
  // 当前选中的筛选索引
  const [ filter, setFilter ] = useState(0)
  // 组织列表数据
  const [ organizations, setOrganizations ] = useState<orginSayhiType[]>()
  // 组织筛选类型
  const [ organFilter, setOrganFilter ] = useState<orginFilterType>('recommend')
  // 搜索输入值
  const [ inputVal, setInputVal ] = useState('')
  const getInputVal = (inputVal: string) => setInputVal(inputVal)
  // 是否正在输入搜索
  const [ isInputing, setIsInputing ] = useState(false)
  // 审核数量统计 [已通过, 待审核, 已拒绝]
  const [ auditCounts, setAuditCounts ] = useState([0, 0, 0])

  // 切换筛选标签
  function switchFilter(nowFilter: number) {
    if(nowFilter === filter){}
    else {
      setFilter(nowFilter)
    }
  }

  // 返回筛选标签的样式类名
  function filterStyle(currentFilter: number) {
    return currentFilter === filter ? 'filter filter-selected' : 'filter'
  }

  // 全部通过按钮点击事件
  const handleApproveAll = () => setPop(true)

  // 全部拒绝按钮点击事件
  const handleRejectAll = async (reason: string) => {
    if (audits && audits.length > 0) {
      for (const audit of audits) {
        // 调用审核API，状态2表示拒绝，并传入拒绝理由
        const res = await auditAudit(reason, audit.id, 2)
        if(res?.data) showMsg(res.data.message)
        else {
          if(res) showMsg(res.msg)
        }
      }
      // 刷新页面数据
      handleRefresh()
    }
  }

  // 弹窗确认回调函数
  const closePop = async (type: boolean) => {
    if (type === true) {
      // 用户点击确认，执行批量审核通过
      if (audits && audits.length > 0) {
        for (const audit of audits) {
          // 调用审核API，状态1表示通过
          const res = await auditAudit('', audit.id, 1)
          if(res?.data) showMsg(res.data.message)
          else {
            if(res) showMsg(res.msg)
          }
        }
        // 刷新页面数据
        handleRefresh()
      }
    }
    // 关闭弹窗
    setPop(false)
  }

  // 新建组织按钮点击事件
  const handleNewOrganization = () => Taro.navigateTo({ url: '/adminPkg/pages/newOrgan/index' })

  // 获取审核数量统计
  useEffect(() => {
    const controller = new AbortController()

    const getAuditCounts = async () => {
      try {
        const [passedRes, pendingRes, rejectedRes] = await Promise.all([
          auditList(1), // 已通过
          auditList(0), // 待审核
          auditList(2)  // 已拒绝
        ])

        if(passedRes?.data && pendingRes?.data && rejectedRes?.data) {
          setAuditCounts([
            passedRes.data.audits.length,
            pendingRes.data.audits.length,
            rejectedRes.data.audits.length
          ])
        }
      } catch (error) {
        console.log('Failed to fetch audit counts:', error)
      }
    }

    if(label === '校友') {
      getAuditCounts()
    }

    return () => controller.abort()
  }, [label, refresh])

  // 根据筛选条件获取数据
  useEffect(() => {
    const controller = new AbortController()

    if( label === '校友' ) {
      // 获取校友认证审核列表
      const getAudits = async () => {
        const res = await auditList(auditStatus)
        if(res?.data) {
          setAudits(res.data.audits)
        } else {
          if(res) showMsg(res.msg)
        }
      }
      getAudits()
    } else {
      // 获取组织列表
      const getOrg = async () => {
        const res = await orgList(controller.signal, inputVal, organFilter)
        if(res?.data) {
          setOrganizations(res.data.organizations)
        } else {
          if(res) showMsg(res.msg)
        }
      }
      getOrg()
    }

    return () => controller.abort()
  }, [filter, label, inputVal, refresh])

  // 根据筛选索引设置对应的API参数
  useMemo(() => {
    if(label === '校友') {
      // 校友认证状态筛选
      switch(filter) {
        case 0: return setAuditStatus(1) // 已通过
        case 1: return setAuditStatus(0) // 待审核
        case 2: return setAuditStatus(2) // 已拒绝
      }
    } else {
      // 组织类型筛选
      switch(filter) {
      case 0: return setOrganFilter('recommend')
      case 1: return setOrganFilter('all')
      case 2: return setOrganFilter('major')
      case 3: return setOrganFilter('location')
      case 4: return setOrganFilter('overseas')
      case 5: return setOrganFilter('industry')
      case 6: return setOrganFilter('hobby')
      }
    }
  }, [filter, label])

  return (
    <View className='organization-audit alumnus'>
      {pop && <PopWindow closePop={closePop} type='全部通过' />}
      <View className='head'>
          <SearchTab getInputVal={getInputVal} setIsInputing={setIsInputing} />
      </View>
      <View className='body'>
        {!isInputing && !inputVal && <ScrollView scroll-x enable-flex className='scroll-tab'>
          <View className={['filter-box', label !== '校友' ? 'box2' : 'box1'].join(' ')}>
            {bodyLabels.map((value, index) => (
              label === '校友' ?
              <View key={`audit-scroll-${index}`} className="alumnus-scroll-box">
                <Text
                className={filterStyle(index)}
                onClick={() => switchFilter(index)}>{value}</Text>
                <Text>{auditCounts && `(${auditCounts[index]})`}</Text>
              </View> :
              <Text
              className={filterStyle(index)}
              onClick={() => switchFilter(index)}
              key={`audit-scroll-${index}`}>{value}</Text>
            ))}
          </View>
        </ScrollView>}
        <View className={['alumnus-box', label === '校友' && 'long-gap-in-bottom'].join(' ')}>
          { label === '校友' ?
            (audits && audits.length !== 0 ? audits.map((value, index) => (
              <AuditItem key={`audit-item-${index}`} type='校友' value={value} />
            )) : <VoidHint type='校友审核列表' />) :
            (organizations && organizations.length !== 0 ? organizations.map((value, index) => (
              <AuditItem key={`alumnus-item-o-${index}`} type='组织' value={value} />
            )) : <VoidHint type='组织管理列表' />)
          }
        </View>
      </View>
      {label === '校友' ? (
        <PassReject handleApprove={handleApproveAll} handleReject={handleRejectAll} />
      ) : (        
        <View className='new-organ'>
          <AdminButton label='新建组织' onClick={handleNewOrganization} />     
        </View>   
      )}
    </View>
  )
}