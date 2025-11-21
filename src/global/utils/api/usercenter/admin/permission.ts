import { http } from "../../request"

export type roleType = {
  createdat: string
  description: string
  id: number
  name: string
  status: number
  updatedat: string
}
/**
 * 获取角色列表
 * @returns data: {
 * page, pagesize,
 * role: roleType
 * total
 * }
 */
export async function permissionRoles(signal: AbortSignal) {
  try {
    const res = await http.get(
      '/api/user/admin/permission/roles',
      { signal }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}

/**
 * 根据学号&姓名获取用户信息
 * @param name 姓名
 * @param studentid 学号
 * @returns data: { users }
 */
export async function userQuery(name: string, studentid: string) {
  try {
    const res = await http.post(
      '/api/user/admin/permission/user/query',
      { name, studentid }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}

/**
 * 删除管理员用户
 * @param userids 用户ID列表
 */
export async function adminsDelete(userids: string[]) {
  try {
    const res = await http.post(
      '/api/user/admin/permission/users/admins/delete',
      { userids }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}


export type adminUserType = {
  createdat: string
  id: number
  name: string
  phone: string
  status: number
  studentid: string
  rolenames: string[]
}
/**
 * 获取管理员用户列表
 * @returns data: {
 *  page, pagesize, total, users
 * }
 */
export async function adminsList(signal: AbortSignal) {
  try {
    const res = await http.get(
      '/api/user/admin/permission/users/admins/list',
      { signal }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}

/**
 * 为用户分配角色
 * @param roleids 角色ID列表
 */
export async function usersRoles(roleids: number[], userid: string, signal?: AbortSignal) {
  try {
    const res = await http.post(
      `/api/user/admin/permission/users/roles`,
      { roleids, userid },
      { signal }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}

/**
 * 获取用户的角色列表
 * @param userid 用户ID
 * @returns data: { roles }
 */
export async function usersRolesget(userid: string, signal: AbortSignal) {
  try {
    const res = await http.get(
      `/api/user/admin/permission/users/roles?userid=${userid}`,
      { signal }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}
