import { http } from "../request"

/**
 * 获取与特定活动相关联的消息
 * @param actiId 活动id
 * @returns data: { msgs, total }
 */
export async function messageActivity(actiId: string, signal: AbortSignal) {
  try {
    const res = await http.get(
      `/api/user/message/activity?activityid=${actiId}`,
      { signal }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 获取消息列表
 * @returns data: { msgs, total }
 */
export async function messageList(signal: AbortSignal, ps?: 'fromHome') {
  try {
    const res = await http.get(
      ps ? '/api/user/message/list?page=1&pagesize=3' : '/api/user/message/list',
      { signal }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 标记消息为已读
 * @param msgIds 消息ID列表
 */
export async function messageRead(msgIds: string[]) {
  try {
    const res = await http.post(
      '/api/user/message/read',
      { messageids: msgIds }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 标记所有消息为已读
 */
export async function readall() {
  try {
    const res = await http.post(
      '/api/user/message/readall'
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 获取未读消息数量
 * @returns data: { count }
 */
export async function unreadCount() {
  try {
    const res = await http.get(
      '/api/user/message/unread/count'
    )
    return res
  } catch (err) {
    console.log(err)    
  }
}