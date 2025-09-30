import axios, { CancelToken } from "axios"
import { http } from "../request"

export type actiType = {
    province: string
    city: string
    district: string
    address: string //详细地址
    locationname: string

    organizerid: string //举办组织id
    contactperson: string
    contactphone: string

    title: string
    coverurl: string
    description: string

    id: string
    isparticipated: boolean
    type: string //0-免费活动 1-付费活动 2-直播活动

    starttime: string
    endtime: string

    createdat?: string
    updatedat?: string
}

export interface actiTypeAdmin extends actiType {
    isfeatured?: boolean //是否推荐 0-否 1-是
    maxparticipants?: number //0-无限制
    registrationdeadline: string //报名截止时间
    status?: number //0-草稿 1-已发布 2-进行中 3-已结束 4-已取消
}

// - - - act - - - //
/**
 * 取消报名活动
 * @param id 活动id
 * @returns 成功-res，失败-undefined
 */
export async function cancel(id: string, cancelToken?: CancelToken) {
    try {
        const res = await http.post( `/activity/activity/act/cancel/${id}`, { cancelToken } )
        return res
    } catch (err) {
        if(axios.isCancel(err)) console.log("请求取消", err.message)
        else console.log(err)
        return undefined
    }
}

/**
 * 获取活动详情
 * @param id 活动id
 * @returns 成功-活动object，失败-undefined
 */
export async function detail(id: string, cancelToken?: CancelToken): Promise<actiType | undefined> {
    try {
        const res = await http.get( `/activity/activity/act/detail/${id}`, { cancelToken } )
        if (res && res.data) return res.data.activity
    } catch (err) {
        if(axios.isCancel(err)) console.log("请求取消", err.message)
        else console.log(err)
        return undefined
    }
}

/**
 * 报名参加活动
 * @param id 活动id
 * @returns 成功-res，失败-undefined
 */
export async function enroll(id: string, cancelToken?: CancelToken) {
    try {
        const res = await http.post( `/activity/activity/act/enroll/${id}`, { cancelToken } )
        return res
    } catch (err) {
        if(axios.isCancel(err)) console.log("请求取消", err.message)
        else console.log(err)
        return undefined
    }
}

/**
 * 获取活动列表
 * @returns 活动object[]
 */
export async function list(cancelToken?: CancelToken): Promise<actiType[] | undefined> {
    try {
        const res = await http.get( '/activity/activity/act/list', { cancelToken } )
        if (res && res.data) return res.data.activities
    } catch (err) {
        if(axios.isCancel(err)) console.log("请求取消", err.message)
        else console.log(err)
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
            '/activity/activity/admin/create',
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
        const res = await http.post( `/activity/activity/admin/delete/${id}` )
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
        const res = await http.get( `/activity/activity/admin/detail/${id}` )
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
        const res = await http.get( '/activity/activity/admin/list' )
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
            `/activity/activity/admin/update/${id}`,
            value
        )
        return res
    } catch (err) {
        console.log(err)
        return undefined
    }
}