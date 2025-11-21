import { http } from "../request"
import type { orginActiType } from "./activity"

export type orginSayhiType = {
  avatar: string 
  name: string
  bio: string
  isfollow?: boolean
  id?: string
}
export type orginType = orginActiType & orginSayhiType & {
  adminuserid?: string
}

/**
 * 获取已加入的组织列表
 * @returns data: { organizations, total }
 */
export async function orgContactList(signal: AbortSignal) {
  try {
    const res = http.get(
      '/api/activity/org/contact/list',
      { signal }
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

export type orginFilterType = 'recommend' | 'all' | 'major' | 'location' | 'overseas' | 'industry' | 'hobby'
//筛选选项: recommend-推荐, all-全部, major-同专业, location-地方, overseas-海外, industry-同行业, hobby-兴趣爱好

/**
 * 获取组织详情
 * @param id 组织ID
 * @returns data: { organization }
 */
export async function orgDetail(id: string, signal: AbortSignal) {
  try {
    const res = http.get(
      `/api/activity/org/detail/${id}`,
      { signal }
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
export async function orgList(signal: AbortSignal, keyword: string, filter: orginFilterType) {
  try {
    const res = http.get(
      keyword ? `/api/activity/org/list?keyword=${keyword}` : `/api/activity/org/list?filter=${filter}`,
      { signal }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}