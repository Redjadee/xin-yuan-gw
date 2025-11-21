import { http } from "../../request"
import { orginType } from "../../activitycenter/org"

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
 * DeleteOrganization
 * @param ids 组织ID
 */
export async function orgDelete(ids: string[]) {
  try {
    const res = http.post(
      '/api/user/admin/org/delete',
      { ids }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}

export async function orgUpdate(orgs: orginType) {
  try {
    const res = http.post(
      '/api/user/admin/org/update',
      { ...orgs }
    )
    return res
  } catch (err) {
    console.log(err)
  }
}