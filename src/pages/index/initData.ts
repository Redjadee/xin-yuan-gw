import { profile, homeImgBase } from '@/global/assets/images/imgBases'
import { MsgType } from './components/MessageContainer'

export interface activityType {
  imgHref: string
  name: string
  time: string
}

export const swiperActivities: activityType[] = [
  {
    imgHref: `${homeImgBase}/acti1.png`,
    name: '活动1',
    time: '6月3日14：00-17：00'
  },
  {
    imgHref: `${homeImgBase}/acti2.png`,
    name: '活动2',
    time: '6月3日14：00-17：00'
  },
  {
    imgHref: `${homeImgBase}/acti3.png`,
    name: '活动3',
    time: '6月3日14：00-17：00'
  },
]
//


export const testMsg: MsgType[] = [
  {
    profileHref: profile, 
    name: '名字',
    content: '内容',
    time: '刚刚'
  },
  {
    profileHref: profile, 
    name: '名字',
    content: '内容',
    time: '刚刚'
  },
  {
    profileHref: profile, 
    name: '名字',
    content: '内容',
    time: '刚刚'
  },
  {
    profileHref: profile, 
    name: '名字',
    content: '内容',
    time: '刚刚'
  },
  {
    profileHref: profile, 
    name: '名字',
    content: '内容',
    time: '刚刚'
  }
]