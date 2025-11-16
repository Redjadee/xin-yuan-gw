import { http } from "../../request"

export type dataOverviewType = {
  activitotalcount: number //活动总数
  averageacitivityparticipatepercentage: number //平均活动参与百分比
  lastsevendayactivepercentage: number //最近7天活跃百分比
  todayincreasepercentage: number //今日新增百分比
  totalusercount: number //校友总数
}
/**
 * 数据总览
 * @returns data: dataOverviewType
 */
export async function dataOverview() {
  try {
    const res = await http.get(
      '/api/user/admin/data/overview',
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}

/**
 * 获取指定日期报表下载链接
 * @param statdate 统计日期，格式: YYYY-MM-DD，例如: 2023-01-01
 * @returns data: {
 * downloadurl 下载链接,
 * filename 文件名
 * }
 */
export async function reportDownload(statdate: string) {
  try {
    const res = await http.get(
      `/api/user/admin/data/report/download?statdate=${statdate}`,
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}

/**
 * 获取指定日期统计数据
 * @param statdate 统计日期，格式: YYYY-MM-DD，例如: 2023-01-01
 * @returns //FIXME 没有写相关类型
 */
export async function dataStatistics(statdate: string) {
  try {
    const res = await http.get(
      `/api/user/admin/data/statistics?statdate=${statdate}`,
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}