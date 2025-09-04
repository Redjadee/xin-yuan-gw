import { http } from "./request"
import { AxiosError } from "axios"

const prefix = '/user'

// - - - base - - -//
export async function textlogin(phone: string) {
  http.post(
    `${prefix}/base/testlogin`,
    {
      phone
    }
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
 * @returns 返回一个graphiccodeReturnType的对象
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
  student_id: string //学号
  id_last_six: string //身份证后6位
  phone: string //手机号
  code: string //验证码
  password: string //TODO 密码 sha1加密
}
/**
 * 学号注册
 * 
 * 接口说明：因为暂时没法和学校学籍库对接，“学籍信息验证”接口暂未完成，暂时使用本接口替代。
 * 两者逻辑上差不多，只是本接口不用微信登录
 * @param studentregisterType的对象
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