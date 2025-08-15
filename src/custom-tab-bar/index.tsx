import { Component } from "react"
import Taro from "@tarojs/taro"
import { CoverView, CoverImage } from '@tarojs/components'

import { connect, ConnectedProps } from 'react-redux'
import { RootState } from '@/store'

// 创建映射函数
const mapStateToProps = (state: RootState) => ({
  tabBarValue: state.tabBar.value,
})

// 创建连接器
const connector = connect(mapStateToProps)

// 定义组件的 Props 类型（包含从 Redux 映射的属性）
type PropsFromRedux = ConnectedProps<typeof connector>

import './index.scss'
import { setTabBar } from "@/store/tabBarSlice"

class Index extends Component<PropsFromRedux> {
    state = {
        selected: this.props.tabBarValue,
        color: '#9CC4E6',
        selectedColor: '#018BBC',
        list: [
            {
                pagePath: 'pages/alumnus/index',
                text: '校友组织',
                iconPath: '',
                selectedIconPath: ''
            },
            {
                pagePath: 'pages/index/index',
                text: '首页',
                iconPath: '',
            },
            {
                pagePath: 'pages/my/index',
                text: '我的',
                iconPath: '',
                selectedIconPath: ''
            }
        ],
    }
    switchTab(index: number, url: string) {
        Taro.switchTab({ url: `/${url}` }) 
        this.props.dispatch(setTabBar(index))  
    }

    render() {
        const { list, selected, color, selectedColor } = this.state
        return (
         <CoverView className="tab-bar">
            {list.map((item, index) => {
                return (
                    <CoverView 
                        key={index} 
                        className={['tab-bar-item', `tab-bar-item${index}`].join(' ')}
                        onClick={this.switchTab.bind(this, index, item.pagePath)}>
                    {/* <CoverImage src={selected === index ? item.selectedIconPath : item.iconPath} /> */}
                    <CoverView 
                        style={{ color: selected === index ? selectedColor : color }}
                        className={selected === index ? 'selected-title' : 'title' }
                    >{item.text}</CoverView>
                    </CoverView>
                )
            })}
         </CoverView>   
        )
    }
}

export default connector(Index)