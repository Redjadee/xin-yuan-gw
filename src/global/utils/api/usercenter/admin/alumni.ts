import { http } from "../../request"


export type newAlumni = {
  birthday: string //出生日期(格式 YYYY-MM-DD)
  class: string //班级
  department: string //上课院系
  enrollmentdate: string //入学时间(格式 YYYY)
  gender: 1 | 2 //性别 1-男 2-女
  idlastsix: string //身份证号后六位
  lengthschooling: string //学制，传入数字，如: 4
  major: string //专业
  name: string
  namepinyin: string //姓名拼音
  studentid: string //学号
}
/**
 * 新增校友信息
 * @param value 新校友信息
 */
export async function alumniAdd(value: newAlumni) {
  try {
    const res = await http.post(
      '/api/user/admin/alumni/add',
      { ...value }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}

/**
 * 文件批量导入校友信息
 * @param fileurl 文件链接
 */
export async function alumniImport(fileurl: string) {
  try {
    const res = await http.post(
      '/api/user/admin/alumni/import',
      { fileurl }
    )
    return res
  } catch (error) {
    console.log(error)
    return undefined
  }
}