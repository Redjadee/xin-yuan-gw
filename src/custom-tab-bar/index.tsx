import { Component } from "react"
import Taro from "@tarojs/taro"
import { View, Image } from '@tarojs/components'

import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '@/store'
import { setTabBar } from "@/store/tabBarSlice"

import './index.scss'

// 创建映射函数
const mapStateToProps = (state: RootState) => ({
  tabBarValue: state.tabBar.value,
  tabBarVisible: state.tabBar.visible,
  loginStatus: state.auth.isLogged,
  verifyStatus: state.auth.isVerified
})

// 创建连接器
const connector = connect(mapStateToProps)

// 定义组件的 Props 类型（包含从 Redux 映射的属性）
type PropsFromRedux = ConnectedProps<typeof connector>

class Index extends Component<PropsFromRedux> {
    state = {
        selected: this.props.tabBarValue,
        color: '#9CC4E6',
        selectedColor: '#018BBC',
        list: [
            {
                pagePath: 'pages/alumnus/index',
                text: '校友组织',
                iconPath: '../global/assets/images/tab-bar/alumnus.png',
                selectedIconPath: '../global/assets/images/tab-bar/alumnus-s.png'
            },
            {
                pagePath: 'pages/index/index',
                text: '首页',
                iconPath: '../global/assets/images/tab-bar/tab-logo2.png',
                selectedIconPath: '../global/assets/images/tab-bar/tab-logo2.png'
            },
            {
                pagePath: 'pages/my/index',
                text: '我的',
                iconPath: '../global/assets/images/tab-bar/my.png',
                selectedIconPath: '../global/assets/images/tab-bar/my-s.png'
            }
        ],
    }
    /**
     * 自定义实现tabbar的选中
     * 
     * 如果选定索引不变，不做任何操作
     * 
     * 如果改变，则检查登录状态，如果未登录，统一跳转登陆页面；如果登录，正常切换tab
     * 同理控制验证状态
     * 
     * @param index 被点击tab对应索引
     * @param url 被点击tab对应url
     */
    switchTab(index: number, url: string) {
        if (index === this.props.tabBarValue) {}
        else {
            if(!this.props.loginStatus) {
                Taro.reLaunch({
                    url: '/loginPkg/pages/login/index'
                })
            } else {
                if(!this.props.verifyStatus) {
                    Taro.navigateTo({
                        url: '/loginPkg/pages/register/index?type=1'
                    })
                } else {
                    Taro.switchTab({ url: `/${url}` }) 
                    this.props.dispatch(setTabBar(index)) 
                }
            }
        }
    }

    render() {
        const { list, selected, color, selectedColor } = this.state
        return (
         <View className={["tab-bar", !this.props.tabBarVisible && `hidden`].join(' ')}>
            {list.map((item, index) => {
                return (
                    <View 
                        key={index} 
                        className={['tab-bar-item', `tab-bar-item${index}`].join(' ')}
                        onClick={this.switchTab.bind(this, index, item.pagePath)}>
                    <Image 
                        src={selected === index ? item.selectedIconPath : item.iconPath} 
                        className={ selected === index ? "tab-bar-img-s" : "tab-bar-img" } />
                    <View 
                        style={{ color: selected === index ? selectedColor : color }}
                        className={selected === index ? 'selected-title' : 'title' }
                    >{item.text}</View>
                    </View>
                )
            })}
         </View>   
        )
    }
}

export default connector(Index)