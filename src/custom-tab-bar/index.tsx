import { Component } from "react"
import Taro from "@tarojs/taro"
import { CoverView, CoverImage } from '@tarojs/components'

import './index.scss'

export default class Index extends Component {
    state = {
        selected: 1,
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
        this.setSelected(index)
        Taro.switchTab({ url })
    }

    setSelected (idx: number) {
        this.setState({
        selected: idx
        })
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