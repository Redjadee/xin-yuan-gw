
/**
 * 检验是否是手机号
 * @param s 待验证数据
 */
export function isPhone(s: string): boolean {
  const regex = /^1[3-9]\d{9}$/
  return regex.test(s)
}

/**
 * 验证入学年份是否合法
 * @param s 待验证数据
 */
export function isValidYear(s: number): boolean {
  const nowYear = new Date().getFullYear()
  if (s <= nowYear) return true
  else return false
}