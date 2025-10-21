import { http } from "../request"
import type { orginActiType } from "./activity"

export type orginSayhiType = {
  avatar: string 
  name: string
  bio: string
  isfollow: boolean
  id: string
}
export type orginType = orginActiType & orginSayhiType & {
  adminuserid: string
}
/**
 * 创建组织
 * @param val 组织属性
 * @returns data: { data, message }
 */
export async function orgCreate(val: orginType) {
  try {
    const res = http.post(
      '/api/activity/org/create',
      { ...val }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 退出组织
 * @param organizationid 组织ID
 */
export async function orgExit(organizationid: string) {
  try {
    const res = http.post(
      '/api/activity/org/exit',
      { organizationid }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 申请加入组织
 * @param organizationid 组织ID
 * @param applicationremark 申请备注
 */
export async function orgJoin(organizationid: string, applicationremark: string) {
  try {
    const res = http.post(
      '/api/activity/org/join',
      { applicationremark, organizationid }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 获取组织列表
 * @returns data: { organizations, total }
 */
export async function orgList(signal: AbortSignal) {
  try {
    const res = http.get(
      '/api/activity/org/list',
      { signal }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}