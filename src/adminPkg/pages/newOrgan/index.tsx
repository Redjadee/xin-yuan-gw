import { View, Image, Input, PageContainer } from "@tarojs/components"
import TextArea from "@/global/components/Textarea"
import { Picker } from "@taroify/core"
import '@taroify/core/picker/style/index'
import { useState, useMemo, useEffect } from "react"
import { useLoad } from '@tarojs/taro'
import { fileUpload } from "@/global/utils/api/usercenter/fileupload"
import { orgCreate, orgDelete, orgUpdate } from "@/global/utils/api/usercenter/admin/org"
import { orgDetail } from "@/global/utils/api/activitycenter/org"
import { showMsg } from "@/global/utils/common"
import Taro from "@tarojs/taro"

import './index.scss'
import '@/global/style/form.scss'
import AdminButton from "@/adminPkg/components/AdminButton"
import PopWindow from "@/pages/alumnus/components/PopWindow"

export default function NewOrgan() {
  // 编辑模式：组织ID
  const [id, setId] = useState('')
  useLoad((options) => {
    if(options.id) {
      setId(options.id)
      Taro.setNavigationBarTitle({ title: '编辑组织' })
    }
  })

  // 表单数据
  const [formData, setFormData] = useState({
    avatar: '', // 组织Logo
    type: 'recommend' as 'recommend' | 'major' | 'location' | 'overseas' | 'industry' | 'hobby', // 组织类型
    name: '', // 组织名称
    bio: '', // 组织描述
    contactphone: '', // 联系方式
  })
  const columns = useMemo(() => [
    { label: '请选择', value: 'recommend', disabled: true },
    { label: '专业', value: 'major' },
    { label: '地方', value: 'location' },
    { label: '海外', value: 'overseas' },
    { label: '行业', value: 'industry' },
    { label: '兴趣爱好', value: 'hobby' },
    { label: '其他', value: 'others' }
  ], [])

  // 显示中文类型名称
  const displayType = useMemo(() => {
    switch(formData.type) {
      case 'recommend': return ''
      case 'major': return '专业'
      case 'location': return '地方'
      case 'overseas': return '海外'
      case 'industry': return '行业'
      case 'hobby': return '兴趣爱好'
      default: return '请选择'
    }
  }, [formData.type])

  // 联系方式输入值（带前缀）
  const contactInputValue = useMemo(() => {
    return formData.contactphone ? '负责人：' + `${formData.contactphone}` : ''
  }, [formData.contactphone])

  // 组织类型输入值（带前缀）
  const typeInputValue = useMemo(() => {
    return displayType ? `组织类型：${displayType}` : ''
  }, [displayType])

  // 编辑模式加载组织数据
  useEffect(() => {
    const controller = new AbortController()

    const loadOrganization = async () => {
      if(id) {
        const res = await orgDetail(id, controller.signal)
        if(res?.data) {
          const organization = res.data.organization
          setFormData({
            avatar: organization.avatar,
            type: organization.type,
            name: organization.name,
            bio: organization.bio,
            contactphone: organization.contactphone
          })
        } else {
          if(res) showMsg(res.msg)
        }
      }
    }
    loadOrganization()

    return () => controller.abort()
  }, [id])

  // 处理图片上传
  const handleUpload = async () => {
    try {
      const finalURL = await fileUpload('avatar', 'original')
      if(finalURL) setFormData(prev => ({ ...prev, avatar: finalURL }))
    } catch (err) {
      console.log('组织Logo上传失败：', err)
    }
  }

  // 通用字段更新函数
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // 类别选择相关状态
  const [ show, setShow ] = useState(true)
  const [ pop, setPop ] = useState(false)
  const openPop = () => {
    setPop(true)
    setShow(false)
  }
  const handleBack = () => {
    setPop(false)
    setShow(true)
    setExplain(false)
  }
  
  const [ explain, setExplain ] = useState(false)
  const [ reason, setreason ] = useState('')
  const getReason = (val: string) => {
    setreason(val)
    setExplain(false)
  }

  // 删除弹窗状态
  const [ deletePop, setDeletePop ] = useState(false)
  const openDeletePop = () => setDeletePop(true)
  const closeDeletePop = (confirm: boolean) => {
    setDeletePop(false)
    if(confirm && id) {
      handleDelete()
    }
  }
  const handleConfirm = (val: string[]) => {
    handleBack()
    console.log(val)
    if(val[0] === 'others') {
      openPop()
      setExplain(true)
    }
    else updateField('type', val[0])
  }

  // 提交创建组织
  const handleSubmit = async () => {
    if(!formData.name) {
      showMsg('请输入组织名称')
      return
    }
    if(!formData.contactphone) {
      showMsg('请输入联系方式')
      return
    }
    if(!formData.type || formData.type === 'recommend') {
      showMsg('请选择组织类型')
      return
    }
    if(!formData.bio) {
      showMsg('请输入组织简介')
      return
    }
    if(!formData.avatar) {
      showMsg('请上传组织Logo')
      return
    }

    const submitData = {
      avatar: formData.avatar,
      name: formData.name,
      bio: formData.bio,
      type: formData.type,
      contactphone: formData.contactphone,
    }

    let res
    if(id) {
      // Edit mode: use orgUpdate API with id
      res = await orgUpdate(submitData)
    } else {
      // Create mode: use orgCreate API
      res = await orgCreate(submitData)
    }
    if(res?.data) {
      showMsg(res.data.message)
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } else {
      if(res) showMsg(res.msg)
    }
  }

  // 删除组织
  const handleDelete = async () => {
    if(!id) return

    const deleteRes = await orgDelete([id])
    if(deleteRes?.data) {
      showMsg(deleteRes.data.message)
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    } else {
      if(deleteRes) showMsg(deleteRes.msg)
    }
  }

  return (
    <View className="new-organ">
      {deletePop && <PopWindow closePop={closeDeletePop} type='删除组织' />}
      <View className="header">
        <Image src={formData.avatar} className="cover" mode="aspectFill" onClick={handleUpload} />
      </View>
      <Input value={formData.name} onInput={e => updateField('name', e.detail.value)} placeholder="请输入组织名称" placeholderClass='inputPH' className='input' />
      <Input
        value={contactInputValue}
        onInput={e => {
          const value = e.detail.value.replace('负责人：', '')
          updateField('contactphone', value)
        }}
        maxlength={11}
        placeholder="请输入联系方式"
        placeholderClass='inputPH'
        className='input'
      />
      <Input
        value={typeInputValue}
        onClick={openPop}
        placeholder="选择组织类型"
        placeholderClass='inputPH'
        className='input'
      />
      <TextArea maxlength={300} placeHolder="组织简介" handleContent={val => updateField('bio', val)} />
      { show && 
      <View className={["bottom-button", id && 'long'].join(' ')}>
        <AdminButton label="确认" onClick={handleSubmit} />
        { id && <AdminButton label="删除组织" onClick={openDeletePop} />}
      </View>}
      <PageContainer
      show={pop}
      round={true}
      onClickOverlay={handleBack}>
        { !explain ? 
        <Picker 
          title='组织类型'
          columns={columns}
          onCancel={handleBack}
          onConfirm={handleConfirm}
        /> :
        <View className="explain-box">
          <TextArea
            key="explain-textarea"
            boxClass="bio-textarea-box"
            textareaClass="bio-textarea"
            placeHolder="请描述情况"
            maxlength={300}
            handleContent={getReason}
          />
        </View>
        }
      </PageContainer>
    </View>
  )
}