import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

type dateFormaterType = 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm'
//ISO 8601 2025-09-23T14:30:00 年-月-日T时:分:秒

/**
 * 日期格式化
 * @param d 待格式化日期 'YYYY-MM-DD HH:mm'
 * @param specificType 指定的日期格式
 */
export function dateFormater( d: string, specificType?: dateFormaterType ) {
  const day = dayjs(d)
  const now = dayjs()
  if(!specificType) {
    if( now.diff(day, 'day') < 3 && now.diff(day, 'day') >= 0) {
      return day.fromNow()
    } else {
      return day.format('YYYY-MM-DD')
    }
  } else {
    return day.format(specificType)
  }
}

/**
 * 计算活动状态
 * @param begin 开始时间 (ISO8601 格式)
 * @param end 结束时间
 * @returns 活动状态
 * 
 * 0 已结束，1 进行中，2 未开始
 */
export function actiStatus(begin: string, end: string) {
  const beginTime = new Date(begin).getTime()
  const endTime = new Date(end).getTime()
  const now = Date.now()
  if ( beginTime > now ) return 2
  else if ( endTime > now ) return 1
  else return 0
}