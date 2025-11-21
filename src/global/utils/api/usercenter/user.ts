import { http } from "../request"

type verifyStuInfor = {
  code: string
  id_last_six: string
  name: string
  phone: string
  studentid?: string
  password: string
}
/**
 * 学籍信息验证
 * @param code 验证码
 * @param id_last_six 身份证码后六位
 * @param name 姓名
 * @param phone 手机号
 * @param studentid 学号
 * @param password 密码 sha1加密
 */
export async function verifystudentinfo({ password, code, id_last_six, name, phone, studentid }: verifyStuInfor) {
  try {
    const res = await http.post(
      '/api/user/user/verifystudentinfo',
      { code, id_last_six, name, phone, studentid, password }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * 忘记学号
 * @param contact_information 联系方式
 * @param detail 详细描述
 */
export async function forgetstudentid(contact_information: string, detail: string) {
  try {
    const res = await http.post(
      '/api/user/user/forgetstudentid',
      { contact_information, detail }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * 修改密码
 */
export async function changepassword(newpassword: string, oldpassword: string) {
  try {
    const res = await http.post(
      '/api/user/user/changepassword',
      { newpassword, oldpassword }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * 更改手机号
 */
export async function changephone(newphone: string, newphonecode: string, oldphone: string, oldphonecode: string) {
  try {
    const res = await http.post(
      '/api/user/user/changephone',
      { newphone, newphonecode, oldphone, oldphonecode }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export type userInforType = {
  avatar: string //头像
  bio: string //简介
  birthday: string //format: 2006-03-03
  city?: string
  district?: string
  gender: 0 | 1 | 2 //性别: 0-未知 1-男 2-女
  hideprofile: boolean
  major?: string
  profession?: string
  province?: string
  realname: string
  studentid: string
  id: string
}
/**
 * 获取个人信息
 * @param userid 用户id，传0查自己
 */
export async function getuserinfo(userid: string, signal: AbortSignal) {
  try {
    const res = await http.get(
      `/api/user/user/getuserinfo/${userid}`,
      { signal }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export type notifiSettingType = {
  notificationtiming: 1 | 2 | 3, //通知时间选择: 1-提前3天 2-提前1天 3-当天
  showphone: 0 | 1 | 2 | 3 | 4, //公开手机号和微信号 手机号 微信号 不公开
  wechatnotificationenabled: 0 | 1 //微信服务通知开关: 0-关闭 1-开启
}

/**
 * 获取通知设置
 * @returns 
 */
export async function getnotificationsettings(signal: AbortSignal) {
  try {
    const res = await http.get(
      '/api/user/user/getnotificationsettings',
      { signal }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * 更新通知设置
 * @param notificationtiming 通知时间选择: 1-提前3天 2-提前1天 3-当天
 * @param showphone 公开手机号和微信号 手机号 微信号 不公开
 * @param wechatnotificationenabled 微信服务通知开关: 0-关闭 1-开启
 */
export async function updatenotificationsettings({ notificationtiming, showphone, wechatnotificationenabled }: notifiSettingType) {
  try {
    const res = await http.post(
      '/api/user/user/updatenotificationsettings',
      { notificationtiming, showphone, wechatnotificationenabled }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export type myInforType = {
  avatar: string //头像
  realname: string
  bio: string //简介
  gender: 0 | 1 | 2 //性别: 0-未知 1-男 2-女
  birthday: string //format: 2006-03-03
  profession?: string
  city?: string
  district?: string
  province?: string
  major?: string
}
/**
 * 修改个人信息
 * @param value 用户信息
 * @param returndata 是否返回完整数据
 * @param hideprofile 隐私设置: 0-公开 1-隐藏
 * @returns 成功-更新后的用户信息
 */
export async function updateuserinfo( value: myInforType | null, returndata: boolean, hideprofile: boolean, signal: AbortSignal ) {
  try {
    const res = await http.post(
      '/api/user/user/updateuserinfo',
      { ...value, returndata, hideprofile },
      { signal }
    )
    // if(res && res.data) return res.data.userinfo
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export type getuserlistType = {
  filtertype: 'all' | 'profession' | 'city' | 'college'
}
/**
 * 获取用户列表
 * 
 * 用于"校友组织"页面的校友
 * 
 * @param filtertype 过滤类型: all-全部, profession-同行业, city-同城, college-同学院
 * @returns 成功-{ total, users }
 */
export async function getuserlist({ filtertype }: getuserlistType) {
  try {
    const res = await http.get(
      `/api/user/user/getuserlist?filtertype=${filtertype}`
    )
    if(res && res.data) return res.data
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * 通过短信验证码修改密码, 请求
 * 
 * 用于“忘记密码”页面
 * 
 * @param code 验证码
 * @param phone 手机号
 */
export async function forgetpasswordRequest(code: string, phone: string) {
  try {
    const res = await http.post(
      '/api/user/user/forgetpassword/request',
      { code, phone }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * 通过短信验证码修改密码, 验证
 * 
 * 用于“重置密码”页面
 * 
 * @returns 成功-res
 */
export async function forgetpasswordVerify(code: string, newpassword: string, token: string) {
  try {
    const res = await http.post(
      '/api/user/user/forgetpassword/verify',
      { code, newpassword, token }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * 通过学号或手机号查询用户信息
 * @param phone 手机号
 * @param studentid 学号
 * @returns 成功-userinfo obj 出错-msg
 */
export async function queryuser(phone?: string, studentid?: string) {
  try {
    const res = await http.post(
      '/api/user/user/queryuser',
      { phone, studentid }
    )
    if(res && res.data) return res.data.userinfo
    else return res.msg
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * 绑定微信账号
 * @param code wx.login()返回的code
 */
export async function bindwechat(code:string) {
  try {
    const res = await http.post(
      '/api/user/user/bindwechat',
      { code }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

/**
 * 注销账号
 */
export async function deleteuser() {
  try {
    const res = await http.post(
      '/api/user/user/cancelaccount',
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 通过短信验证码修改手机号
 * @param code 验证码
 * @param newphone 新手机号
 */
export async function changephonebycode(code: string, newphone: string) {
  try {
    const res = await http.post(
      '/api/user/user/changephonebycode',
      { code, newphone }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

export type jobCategoryType = {
  name: string
  code: number
  subLevelModelList: jobCategoryType
}
/**
 * 获取职业分类列表
 * @returns data: { categories }
 */
export async function getjobcategories() {
  try {
    const res = await http.get(
      '/api/user/user/getjobcategories',
    )
    return res
  } catch (err) {
    console.log(err)
  }
}