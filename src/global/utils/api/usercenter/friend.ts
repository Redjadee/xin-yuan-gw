import { http } from "../request"

/**
 * 通讯录列表
 * @returns data: { total, users }
 */
export async function contactList(signal: AbortSignal) {
  try {
    const res = await http.get(
      '/api/user/friend/contact/list',
      { signal }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 获取打招呼列表
 * @returns data: { greetings, total }
 */
export async function greetingList() {
  try {
    const res = await http.get(
      '/api/user/friend/greeting/list'
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 回应打招呼
 * @param greetingid 打招呼记录ID
 * @param status 回应状态: 1-已回应 2-已忽略
 */
export async function greetingRespond(greetingid: string, status: 1 | 2) {
  try {
    const res = await http.post(
      '/api/user/friend/greeting/respond',
      { greetingid, status }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 发送打招呼请求
 * @param touserid 接收打招呼的用户ID
 */
export async function greetingSend(touserid: string) {
  try {
    const res = await http.post(
      '/api/user/friend/greeting/send',
      { touserid }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

export type alumnusSayhiType = {
  bio: string
  avatar: string
  id: string
  name: string
  isfollow: boolean
}
export type filterType = 'recommend' | 'all' | 'location' | 'industry' | 'college' | 'grade'
/**
 * 获取可打招呼的人员列表
 * @param filter 筛选选项: recommend-推荐, all-全部, location-同城, industry-同行业, college-同学院
 * @returns data: { total, users }
 */
export async function potentialList(filter: filterType, signal: AbortSignal, keyword: string) {
  try {
    const res = await http.get(
      keyword === '' ? `/api/user/friend/potential/list?filter=${filter}` : `/api/user/friend/potential/list?keyword=${keyword}`,
      { signal }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 取消关注用户
 * @param userid 要取消关注的用户ID
 */
export async function friendUnfollow(userid: string) {
  try {
    const res = await http.post(
      '/api/user/friend/unfollow',
      { userid }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}