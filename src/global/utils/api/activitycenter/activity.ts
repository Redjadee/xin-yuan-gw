import { http } from "../request"
import axios from 'axios'
import { showMsg } from "../../common"

export type actiType = orginActiType & {
    locationname: string
    organizerid: string //举办组织id
    title: string
    coverurl: string
    description: string

    id: string
    isparticipated: 0 | 1
    type: '0' | '1' | '2' | '3' //0-免费活动 1-付费活动 2-直播活动 3-线下活动

    starttime: string
    endtime: string
    status: number //0-草稿 1-已发布 2-进行中 3-已结束 4-已取消
    
    createdat?: string
    updatedat?: string
}
export type orginActiType = { //同时出现在活动和组织中的属性
    address: string //详细地址
    district: string
    city: string
    contactperson: string
    contactphone: string
    province: string
}

export type actiTypeAdmin = actiType & {
    isfeatured?: '0' | '1' //是否推荐 0-否 1-是
    maxparticipants?: number //0-无限制
    registrationdeadline?: string //报名截止时间
}

// - - - act - - - //
/**
 * 取消报名活动
 * @param id 活动id
 * @returns 成功-res，失败-undefined
 */
export async function cancel(id: string) {
    try {
        const res = await http.post( `/api/activity/activity/act/cancel/${id}` )
        return res
    } catch (err) {
        console.log(err)
        return undefined
    }
}

/**
 * 获取活动详情
 * @param id 活动id
 * @returns data: { activity }
 */
export async function detail(id: string, signal: AbortSignal) {
    try {
        const res = await http.get( `/api/activity/activity/act/detail/${id}`, { signal } )
        return res
    } catch (err) {
        if(!axios.isCancel(err)) showMsg("数据加载失败，请稍后再试")
        console.log(err)
        return undefined
    }
}

/**
 * 报名参加活动
 * @param id 活动id
 * @returns 成功-res，失败-undefined
 */
export async function enroll(id: string) {
    try {
        const res = await http.post( `/api/activity/activity/act/enroll/${id}` )
        return res
    } catch (err) {
        console.log(err)
        return undefined
    }
}

/**
 * 获取活动列表
 * @param isparticipated 是否已报名 0-未报名 1-已报名
 * @param status 活动状态 0-草稿 1-已发布 2-进行中 3-已结束 4-已取消 默认1已发布
 * @param type 0-免费活动 1-付费活动 2-直播活动 3-线下活动
 * @returns 成功-活动object[]
 */
export async function list(signal: AbortSignal, isparticipated: '1' | '0' | '2', status: '0' | '1' | '2' | '3' | '4', keyword: string, type?: '0' | '1' | '2' | '3') {    
    let url = `/api/activity/activity/act/list?status=${status}`
    if(isparticipated === '1') url += '&isparticipated=1'
    if(type) url += `&type=${type}`
    if(keyword !== '') url+= `&keyword=${keyword}`
    try {
        const res = await http.get( url , { signal } )
        if (res && res.data) return res.data.activities
    } catch (err) {    
        console.log(err)
    }
}

/**
 * 获取推荐活动
 * @returns data: { total, activities }
 */
export async function actRecommend(signal: AbortSignal) {
    try {
        const res = await http.get( '/api/activity/activity/act/recommend', { signal } )
        return res
    } catch (err) {
        console.log(err)
        return undefined
    }
}

// - - - admin - - - //
/**
 * 创建活动
 * @param value 活动详细信息
 * @returns 成功-res，失败-undefined
 */
export async function create(value: actiTypeAdmin) {
    try {
        const res = await http.post(
            '/api/activity/activity/admin/create',
            value
        )
        return res
    } catch (err) {
        console.log(err)
        return undefined
    }
}

/**
 * 删除活动
 * @param id 活动id
 * @returns 成功-res，失败-undefined
 */
export async function Actidelete(id: string) {
    try {
        const res = await http.post( `/api/activity/activity/admin/delete/${id}` )
        return res
    } catch (err) {
        console.log(err)
        return undefined
    }
}

/**
 * 获取活动详情(管理员版)
 * @param id 活动id
 * @returns 成功-活动object，失败-undefined
 */
export async function adminDetail(id: string): Promise<actiTypeAdmin | undefined> {
    try {
        const res = await http.get( `/api/activity/activity/admin/detail/${id}` )
        if(res && res.data) return res.data.activity
    } catch (err) {
        console.log(err)
        return undefined
    }
}

/**
 * 获取活动列表(管理员版)
 * @returns 活动object[]
 */
export async function adminList(): Promise<actiType[] | undefined> {
    try {
        const res = await http.get( '/api/activity/activity/admin/list' )
        if(res && res.data) return res.data.activities
    } catch (err) {
        console.log(err)
        return undefined
    } 
}

/**
 * 更新活动
 * @param value 活动object
 * @returns 成功-res，失败-undefined
 */
export async function update(value: actiTypeAdmin, id: string) {
    try {
        const res = await http.post( 
            `/api/activity/activity/admin/update/${id}`,
            value
        )
        return res
    } catch (err) {
        console.log(err)
        return undefined
    }
}