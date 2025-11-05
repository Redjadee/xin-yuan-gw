import { View, Text, Image } from "@tarojs/components"
import { deleteuser } from "@/global/utils/api/usercenter/user"
import { showMsg } from "@/global/utils/common"
import { useDispatch } from "react-redux"
import { logout } from "@/store/authSlice"
import { setTabBar } from "@/store/tabBarSlice"
import Taro from "@tarojs/taro"
import PopWindow from "@/pages/alumnus/components/PopWindow"
import { useState } from "react"

import { myImgBase } from "@/global/assets/images/imgBases"
import './index.scss'

export default function Setting() {
  const dispatch = useDispatch()

  const upperLabels = ['通知设置', '隐私设置', '账号安全', '帮助与服务']
  const belowLabels = ['注销账号', '退出登录']
  
  const handleRouter = (idx: number) => { //FIXME
    switch(idx) {
      case 0: 
      case 1:
      case 2:
      case 3:
    }
  }

  const [ pop, setPop ] = useState(false)
  const handleDelete = async (type: boolean) => {
    if(type) {
      const res = await deleteuser()
        if(res?.data) {
          showMsg(res.data.message)
          dispatch(logout())
          dispatch(setTabBar(1))
          setTimeout(() => {
            Taro.reLaunch({ url: '/pages/index/index' })
          }, 2000)
        }
        else {
          if(res) showMsg(res.msg)
      }
    } else {}
    setPop(false)
  }

  const handleClick = async (idx: number) => {
    switch(idx) {
      case 0: {
        setPop(true)
      }; break;
      case 1: { //TODO 提示信息
        dispatch(logout())
        dispatch(setTabBar(1))
        Taro.reLaunch({
          url: '/pages/index/index'
        })
      }; break;
    }
  }

  return (
    <View className="setting">
      { pop && <PopWindow type='注销' closePop={handleDelete} /> }
      <View className="upper-box">
        {upperLabels.map((value, index) => (
          <View onClick={() => handleRouter(index)} className="upper-item" key={`setting-upper-${index}`}>
            <Text>{value}</Text>
            <Image className="arrow" src={`${myImgBase}/itemArrow.png`} />
          </View>
        ))}
      </View>
      {belowLabels.map((value, index) => (
        <View onClick={() => handleClick(index)} className="below-item" key={`setting-below-${index}`}>
          <Text>{value}</Text>
        </View>
      ))}
    </View>
  )
}