import { http } from "../../request"

/**
 * 广播通知
 * @param content 通知内容
 * @param title 通知标题
 */
export async function messageBroadcast(content: string, title: string) {
  try {
    const res = await http.post(
      '/api/user/admin/message/broadcast',
      { content, title }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}