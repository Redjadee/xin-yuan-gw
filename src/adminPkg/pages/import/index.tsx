import { View, Text, Input, RadioGroup, Radio, Button, PageContainer } from '@tarojs/components'
import { useState, useMemo, useRef } from 'react'
import { alumniAdd, alumniImport, type newAlumni } from '@/global/utils/api/usercenter/admin/alumni'
import { showMsg } from '@/global/utils/common'
import { fileUpload } from '@/global/utils/api/usercenter/fileupload'
import { DatetimePicker, Picker } from '@taroify/core'
import '@taroify/core/datetime-picker/style/index'
import '@taroify/core/picker/style/index'

import './index.scss'
import '@/global/style/form.scss'

interface propsType {
  pop: boolean
  type: 'birthday' | 'department' | 'major'
  updateField: (field: keyof newAlumni, value: string | number) => void
  handleBack: () => void
  isCustomMajor: () => void
}

function PopUp({ type, updateField, handleBack, pop, isCustomMajor }: propsType) {

  const handleSubmit = (val: Date | string | string[]) => {
    if(val instanceof Date && type === 'birthday') {
      const formatDate = (d: Date) => {
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
      updateField('birthday', formatDate(val))
    } else if (type === 'major') {
      if(val[0] === '其它') {
        updateField('major', '')
        isCustomMajor()
      }
      else updateField('major', val[0])
    } else if (type === 'department') {
      updateField('department', val[0])
    }
    handleBack()
  }

  //生日
  const nowDate = useRef(new Date())
  const minDate = useRef(new Date(1970, 0, 1))
  const defaultDate = useRef(new Date(2000, 0, 1))
  //

  const content = useMemo(() => {
    if(type === 'birthday') {
      return (
        <DatetimePicker type='date' onCancel={handleBack} onConfirm={handleSubmit} defaultValue={defaultDate.current} max={nowDate.current} min={minDate.current}>
          <DatetimePicker.Toolbar>
            <DatetimePicker.Button>取消</DatetimePicker.Button>
            <DatetimePicker.Title>选择日期</DatetimePicker.Title>
            <DatetimePicker.Button>确认</DatetimePicker.Button>
          </DatetimePicker.Toolbar>
        </DatetimePicker>
      )
    } else {
      const departmentOptions = [
        { label: '计算机学院', value: '计算机学院' },
        { label: '数学学院', value: '数学学院' },
        { label: '物理学院', value: '物理学院' }
      ]
      const majorOptions = [
        { label: '计算机科学与技术', value: '计算机科学与技术' },
        { label: '软件工程', value: '软件工程' },
        { label: '网络空间安全', value: '网络空间安全' },
        { label: '其它', value: '其它' }
      ]
      const columns = type === 'department' ? departmentOptions : majorOptions
      const title = type === 'department' ? '选择上课院系' : '选择专业'
      return (
        <Picker
          title={title}
          columns={columns}
          onCancel={handleBack}
          onConfirm={handleSubmit}
        />
      )
    }
  }, [type])
  return (
    <PageContainer
    show={pop}
    round={true}
    onClickOverlay={handleBack}
    className="import-pop-up">
      {content}
    </PageContainer>
  )
}

export default function Import() {
  // 表单数据状态
  const [formData, setFormData] = useState<Partial<newAlumni>>({
    studentid: '',
    name: '',
    namepinyin: '',
    idlastsix: '',
    gender: 1,
    birthday: '',
    enrollmentdate: '',
    department: '',
    major: '',
    class: '',
    lengthschooling: ''
  })

  // 通用字段更新函数
  const updateField = (field: keyof newAlumni, value: string | number) => setFormData(prev => ({ ...prev, [field]: value }))
  
  // 处理文件导入
  const handleFileImport = async () => {
    try {
      showMsg('请选择文件...')
      // 使用现有的fileUpload API上传文件，获取URL
      const fileUrl = await fileUpload('avatar', 'original')

      showMsg('正在导入校友数据...')
      // 调用校友导入API
      const importResult = await alumniImport(fileUrl)

      if (importResult?.data) {
        showMsg(importResult.data.message || '导入成功')
      } else {
        if (importResult) showMsg(importResult.msg || '导入失败')
      }
    } catch (error) {
      console.log('文件导入失败：', error)
      showMsg('导入失败，请重试')
    }
  }

  // 处理表单提交
  const handleSubmit = async () => {
    // 验证必填字段
    if (!formData.name) {
      showMsg('请输入姓名')
      return
    }
    if (!formData.studentid) {
      showMsg('请输入学号')
      return
    }
    if (!formData.idlastsix) {
      showMsg('请输入身份证号后六位')
      return
    }

    try {
      const res = await alumniAdd(formData as newAlumni)
      if (res?.data) {
        showMsg(res.data.message)
        // 清空表单
        setFormData({
          studentid: '',
          name: '',
          namepinyin: '',
          idlastsix: '',
          gender: 1,
          birthday: '',
          enrollmentdate: '',
          department: '',
          major: '',
          class: '',
          lengthschooling: ''
        })
      } else {
        if (res) showMsg(res.msg)
      }
    } catch (error) {
      console.log('添加校友失败：', error)
      showMsg('添加失败，请重试')
    }
  }

  const [ pop, setPop ] = useState(false)
  const closePop = () => setPop(false)
  const [ poptype, setPoptype ] = useState<'birthday' | 'department' | 'major'>('birthday')
  const openPop = (type: 'birthday' | 'department' | 'major') => {
    setPop(true)
    setPoptype(type)
  }

  const [ customMajor, setCustomMajor ] = useState(false)
  const isCustomMajor = () => setCustomMajor(true)

  return (
    <View className='import'>
      { pop && <PopUp isCustomMajor={isCustomMajor} pop={pop} type={poptype} handleBack={closePop} updateField={updateField} /> }
      <View className='form'>
        <Input
          value={formData.studentid || ''}
          onInput={e => updateField('studentid', e.detail.value)}
          type='number'
          maxlength={11}
          className='input'
          placeholder='请输入学号'
          placeholderClass='inputPH'
        />
        <Input
          value={formData.name || ''}
          onInput={e => updateField('name', e.detail.value)}
          type='text'
          className='input'
          placeholder='请输入姓名'
          placeholderClass='inputPH'
        />
        <Input
          value={formData.namepinyin || ''}
          onInput={e => updateField('namepinyin', e.detail.value)}
          type='text'
          className='input'
          placeholder='请输入姓名拼音'
          placeholderClass='inputPH'
        />
        <Input
          value={formData.idlastsix || ''}
          onInput={e => updateField('idlastsix', e.detail.value)}
          maxlength={6}
          type='number'
          className='input'
          placeholder='请输入身份证号后六位'
          placeholderClass='inputPH'
        />
        <View className='gender-selection'>
          <Text>请选择性别</Text>
          <RadioGroup>
            <Radio
              checked={formData.gender === 1}
              color="#018BBC"
              onClick={() => updateField('gender', 1)}
              style={{ marginRight: 10 }}
            >
              男
            </Radio>
            <Radio
              checked={formData.gender === 2}
              color="#018BBC"
              onClick={() => updateField('gender', 2)}
            >
              女
            </Radio>
          </RadioGroup>
        </View>
        <Input
          value={formData.birthday || ''}
          onClick={() => openPop('birthday')}
          type='text'
          className='input'
          placeholder='请选择出生日期'
          placeholderClass='inputPH'
        />
        <Input
          maxlength={4}
          value={formData.enrollmentdate || ''}
          onInput={e => updateField('enrollmentdate', e.detail.value)}
          type='number'
          className='input'
          placeholder='请输入入学年份'
          placeholderClass='inputPH'
        />
        <Input
          value={formData.department || ''}
          onClick={() => openPop('department')}
          type='text'
          className='input'
          placeholder='请选择上课院系'
          placeholderClass='inputPH'
        />
        <Input
          value={formData.major || ''}
          onClick={() => openPop('major')}
          onInput={e => updateField('major', e.detail.value)}
          onBlur={() => setCustomMajor(false)}
          type='text'
          className='input major-input'
          placeholder='请选择专业名称'
          placeholderClass='inputPH'
          focus={customMajor}
        />
        <Input
          value={formData.class || ''}
          onInput={e => updateField('class', e.detail.value)}
          className='input'
          placeholder='请输入班级'
          placeholderClass='inputPH'
        />
        <Input
          value={formData.lengthschooling || ''}
          onInput={e => updateField('lengthschooling', e.detail.value)}
          className='input'
          placeholder='请输入学制'
          placeholderClass='inputPH'
        />
      </View>
      <View className='submit-box'> 
        <Button className='submit-button' onClick={handleSubmit}><Text>提交</Text></Button>
        <Button className='submit-button' onClick={handleFileImport}><Text>一键导入</Text></Button>
      </View>
    </View>
  )
}