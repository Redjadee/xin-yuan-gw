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

export type conversationType = 'personal' | 'activity' | 'broadcast'
/**
 * 获取对话内容
 * @param id 对应的个人/活动ID
 * @param type 对话类型: personal-个人, activity-活动, broadcast-广播
 */
export async function conversation(id: string, type: conversationType, signal: AbortSignal) {
  try {
    const res = await http.get(
      `/api/user/message/conversation?id=${id}&type=${type}`,
      { signal }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

/**
 * 是否已发送联系方式
 * @param touserid 接收打招呼的用户ID
 * @returns data: { exchanged: boolean }
 */
export async function isexchanged(signal: AbortSignal, touserid: string) {
  try {
    const res = await http.get(
      `/api/user/message/isexchanged?touserid=${touserid}`,
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
 * 发送联系方式
 * @param phone 手机号
 * @param touserid 接收打招呼的用户ID
 */
export async function sendContact(phone: string, touserid: string) {
  try {
    const res = await http.post(
      '/api/user/message/send/contact',
      { phone, touserid, wechat: '' }
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