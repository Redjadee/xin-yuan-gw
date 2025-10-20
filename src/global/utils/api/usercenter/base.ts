import { http } from "../request"

/**
 * 微信登陆注册
 * @param code 微信验证码
 * @returns 成功-token，失败-undefined
 * @example
 * wechatlogin('42')
 */
export async function wechatlogin(code: string) {
  try {
    const res = await http.post(
      '/api/user/base/wechatlogin',
      { code }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}

type studentregisterType = {
  student_id: string
  id_last_six: string
  phone: string
  code: string
  password: string
  name: string
}
/**
 * 学号注册
 * 
 * @param student_id 学号
 * @param id_last_six 身份证后六位
 * @param phone 手机号
 * @param code 手机验证码
 * @param password 密码
 * @param name 真实姓名
 */
export async function studentregister({ student_id, id_last_six, phone, code, password, name  }: studentregisterType) {
  try {
    const res = await http.post(
      '/api/user/base/studentregister',
      { student_id, id_last_six, phone, code, password, name }
    )
    return res
  } catch (error) {
    return undefined
  }
}

type loginType = {
  captcha_id: string
  password: string
  phone: string
}
/**
 * 手机号/学号登录
 * @param captcha_id 验证id
 * @param password 密码
 * @param phone 手机号或学号
 */
export async function login({ captcha_id, password, phone }: loginType) {
  try {
    const res = await http.post(
      '/api/user/base/login',
      { captcha_id, password, phone }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

type smsReturnType = {
  code: number
  data: {
    message: string
  }
  msg: string
}
/**
 * 请求短信验证码（默认123456）
 * @param phone
 */
export async function requestsmscode(phone: string) {
  try {
    const res: smsReturnType = await http.post(
      '/api/user/base/requestsmscode',
      { phone }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export type slidecaptchaReturnType = {
  captcha_id: string
  master_image: string //主图
  tile_height: number
  tile_image: string //拼图
  tile_width: number
  tile_x: number //目标位置
  tile_y: number //目标位置
}
/**
 * 滑动验证码
 * @returns 验证码object
 */
export async function slidecaptcha(signal: AbortSignal): Promise<slidecaptchaReturnType | undefined> {
  try {
    const res = await http.get( 
      '/api/user/base/slidecaptcha',
      { signal }
    )
    if(res) return res.data
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export type verifyslidecaptchaType = {
  captcha_id: string
  src_x: number
  src_y: number
}
/**
 * 验证滑动验证码
 * @param captcha_id
 * @param src_x
 * @param src_y
 * @returns 成功-true
 */
export async function verifyslidecaptcha({ captcha_id, src_x, src_y }: verifyslidecaptchaType): Promise<boolean | undefined> {
  try {
    const res = await http.post(
      '/api/user/base/verifyslidecaptcha',
      { captcha_id, src_x, src_y }
    )
    if(res && res.data) return res.data.success
  } catch (err) {
    console.log(err)
    return undefined
  }
}