import { http } from "../../request"

/**
 * 审核信息
 * @param audit_remark 审核备注
 * @param id 审核单ID
 * @param status 状态: 0-待审核, 1-审核通过, 2-审核拒绝
 */
export async function auditAudit(audit_remark: string, id: string, status: 0 | 1 | 2) {
  try {
    const res = await http.post(
      '/api/user/admin/audit/audit',
      { audit_remark, id, status }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}

/**
 * 获取审核单详情
 * @param id 审核单ID
 * @returns data: { audit }
 */
export async function auditDetail(id: string) {
  try {
    const res = await http.get(
      `/api/user/admin/audit/detail/${id}`,
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}

/**
 * 获取审核单列表
 * @param status 状态: 0-待审核, 1-审核通过, 2-审核拒绝
 * @returns data: {
 *  audits, page, pagesize, total
 * }
 */
export async function auditList(status: 0|1|2) {
  try {
    const res = await http.get(
      `/api/user/admin/audit/list?status=${status}`,
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}