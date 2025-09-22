import { http } from "../request"
import { AxiosError } from "axios"

const prefix = '/user'

export async function textlogin(phone: string) {
  http.post(
    `${prefix}/base/testlogin`,
    { phone }
  ).then(res => {
    console.log(res.status)
  }).catch((error: AxiosError) => {
    console.log(error.response?.data)
  })
}

/**
 * 微信登陆注册
 * @param code 微信验证码
 * @returns 若成功，返回token，若失败，返回undefined
 * @example
 * wechatlogin('42')
 */
export async function wechatlogin(code: string): Promise<string | undefined> {
  try {
    const res = await http.post(
      `${prefix}/base/wechatlogin`,
      { code }
    )
    return res.data.token
  } catch (error) {
    console.log(error)
    return undefined
  }
}

interface graphiccodeReturnType {
  code: number
  msg: string
  data: {
    captcha_image: string
    captcha_id: string
  }
}
/**
 * 获取图形验证码
 * @returns 图形验证码的id和图片编码 
 */
export async function graphiccode(): Promise<graphiccodeReturnType | undefined> {
  try {
    const res = await http.get(`${prefix}/base/graphiccode`)
    return res.data
  } catch (error) {
    console.log(error)
    return undefined
  }
}

interface studentregisterType {
  student_id: string
  id_last_six: string
  phone: string
  code: string
  password: string
}
/**
 * 学号注册
 * 
 * 接口说明：因为暂时没法和学校学籍库对接，“学籍信息验证”接口暂未完成，暂时使用本接口替代。
 * 两者逻辑上差不多，只是本接口不用微信登录
 * 
 * @param student_id 学号
 * @param id_last_six 身份证后六位
 * @param phone 手机号
 * @param code 手机验证码
 * @param password 密码
 * 
 * @returns 暂未确定 //FIXME
 */
export async function studentregister({ student_id, id_last_six, phone, code, password  }: studentregisterType): Promise<null | undefined> {
  try {
    const res = await http.post(
      `${prefix}/base/studentregister`,
      { student_id, id_last_six, phone, code, password }
    )
    return res.data
  } catch (error) {
    return undefined
  }
}

interface loginType {
  captcha_id: string
  captcha_code: string
  password: string
  phone: string
}
/**
 * 手机号/学号登录
 * @param captcha_id 验证id
 * @param captcha_code 验证码
 * @param password 密码
 * @param phone 手机号或学号
 * @returns 成功返回token，失败返回undefined
 */
export async function login({ captcha_id, captcha_code, password, phone }: loginType) {
  try {
    const res = await http.post(
      `${prefix}/base/login`,
      { captcha_id, captcha_code, password, phone }
    )
    return res.data
  } catch (err) {
    console.log(err)
    return undefined
  }
}

interface smsReturnType {
  code: number
  data: {
    message: string
  }
  msg: string
}
/**
 * 请求短信验证码（默认123456）
 * @param phone 
 * @returns 成功则返回成功响应体，失败则返回undefined
 */
export async function requestsmscode(phone: string) {
  try {
    const res: smsReturnType = await http.post(
      `${prefix}/base/requestsmscode`,
      { phone }
    )
    return res
  } catch (err) {
    console.log(err)
    return undefined
  }
}