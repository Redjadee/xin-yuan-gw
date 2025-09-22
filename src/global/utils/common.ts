
// TODO 时间计算器
// 1天前 5小时前 ...

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